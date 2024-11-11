import { app, shell, BrowserWindow, ipcMain, dialog, protocol } from 'electron'
import { join, basename } from 'path'
import { promises as fs } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import start from './eventHandler'

import icon from '../../resources/icon.png?asset'

// 注册自定义协议方案
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local-yuanshan',
    privileges: {
      secure: true,
      supportFetchAPI: true,
      standard: true,
      bypassCSP: true,
      stream: true
    }
  }
])

// 获取应用的安装目录路径
const appPath = app.getPath('appData') // 或者使用 'userData'，取决于您的需求
const tempDir = join(appPath, 'yuanshan/temp')

// 确保临时目录存在
;(async () => {
  await fs.mkdir(tempDir, { recursive: true })
})()

function createWindow(): void {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    show: false,
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false // 允许跨域
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 环境检测，判断是否是开发环境
  const url = process.env['ELECTRON_RENDERER_URL']
  if (is.dev && url) {
    mainWindow.loadURL(url)
    // 打开开发者工具
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 应用启动时
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  // 创建窗口
  createWindow()

  // 启动自定义事件监听
  start()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  //   启用自定义协议
  protocol.handle('local-yuanshan', async (request) => {
    // 解码 URL
    console.log('request.url', request.url)
    const decodedUrl = decodeURIComponent(
      request.url
        .replace(new RegExp('^local-yuanshan://', 'i'), '')
        .replace(/^([a-z]):?\/?/i, (match) => {
          const letter = match.charAt(0).toUpperCase() + ':'
          return `${letter}/`
        })
    )
    console.log('decodedUrl:', decodedUrl)

    // 拼接完整的文件路径
    const fullPath = process.platform === 'win32' ? join(decodedUrl) : decodedUrl
    console.log('fullPath:', fullPath)

    // 读取文件
    const data = await fs.readFile(fullPath)
    console.log('data:', data)

    // 返回文件
    return new Response(data)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 监听渲染进程发送的上传文件请求
ipcMain.on('upload-files', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections']
  })

  if (canceled) {
    event.reply('upload-files', { success: false, message: 'No files were selected' })
    return
  }

  try {
    const uploadedFiles = await Promise.all(
      filePaths.map(async (srcPath) => {
        const fileName = basename(srcPath)
        const destPath = join(tempDir, fileName)
        await fs.copyFile(srcPath, destPath)
        return destPath
      })
    )

    event.reply('upload-files', { success: true, files: uploadedFiles })
  } catch (error: any) {
    event.reply('upload-files', { success: false, message: error.message })
  }
})
