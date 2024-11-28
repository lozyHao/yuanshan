import { app, shell, BrowserWindow, ipcMain, protocol } from 'electron'
import { join } from 'path'
import { promises as fs } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

import start from './eventHandler'

import icon from '../../resources/icon.png?asset'

// 禁用安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

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

function createWindow(): void {
	console.log('createWindow')
	// 创建浏览器窗口
	const mainWindow: BrowserWindow = new BrowserWindow({
		width: 1080,
		height: 600,
		minWidth: 1080,
		minHeight: 640,
		show: false,
		autoHideMenuBar: true,
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: '#ffffff00',
			symbolColor: '#999',
			height: 40
		},
		...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false,
			webSecurity: false // 允许跨域
		}
	})

	mainWindow.on('ready-to-show', () => {
		console.log('ready-to-show')
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
	console.log('app.whenReady')
	electronApp.setAppUserModelId('com.lozyhao')

	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	ipcMain.on('ping', () => console.log('pong'))

	// 创建窗口
	createWindow()

	setTimeout(() => {
		const mainWindow = BrowserWindow.getAllWindows()[0];
		if (mainWindow) {
			mainWindow.show();
		}
	}, 2000);

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
