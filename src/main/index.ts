import { app, shell, BrowserWindow, ipcMain, protocol } from 'electron'
import { join, normalize, relative, isAbsolute } from 'path'
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
			stream: true
		}
	}
])

// 应用临时目录（图片打开时复制到这里）
const getTempBaseDir = (): string => normalize(join(app.getPath('appData'), 'yuanshan'))

// 清理上次运行残留的临时文件——非阻塞、容错，绝不阻塞窗口创建
const cleanupTemp = (): void => {
	fs.rm(join(getTempBaseDir(), 'temp'), { recursive: true, force: true, maxRetries: 3 }).catch(
		() => {
			// 清理失败不影响使用
		}
	)
}

function createWindow(): void {
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
			sandbox: false
		}
	})

	mainWindow.on('ready-to-show', () => {
		mainWindow.show()
	})

	// 兜底：若 ready-to-show 未按预期触发（个别打包环境），加载完成后也确保显示
	mainWindow.webContents.on('did-finish-load', () => {
		if (!mainWindow.isVisible()) mainWindow.show()
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

// 显示并聚焦已有窗口（用于二次启动 / 激活）
function focusMainWindow(): void {
	const win = BrowserWindow.getAllWindows()[0]
	if (!win) {
		createWindow()
		return
	}
	if (win.isMinimized()) win.restore()
	if (!win.isVisible()) win.show()
	win.focus()
}

// 单实例锁：避免二次启动产生新的后台进程导致“挂后台打不开”
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
	app.quit()
} else {
	// 已有实例在运行时，二次启动会触发这里，聚焦回已有窗口
	app.on('second-instance', () => {
		focusMainWindow()
	})

	// 应用启动时
	app.whenReady().then(() => {
		electronApp.setAppUserModelId('com.lozyhao')

		app.on('browser-window-created', (_, window) => {
			optimizer.watchWindowShortcuts(window)
		})

		ipcMain.on('ping', () => console.log('pong'))

		// 先创建窗口，保证窗口尽快显示
		createWindow()

		// 启动自定义事件监听
		start()

		// 非阻塞清理临时文件（不阻塞窗口创建）
		cleanupTemp()

		app.on('activate', function () {
			focusMainWindow()
		})

		// 启用自定义协议：仅允许读取应用临时目录内的文件，防止任意文件读取（路径穿越）
		protocol.handle('local-yuanshan', async (request) => {
			try {
				const decodedUrl = decodeURIComponent(
					request.url
						.replace(new RegExp('^local-yuanshan://', 'i'), '')
						.replace(/^([a-z]):?\/?/i, (match) => {
							const letter = match.charAt(0).toUpperCase() + ':'
							return `${letter}/`
						})
				)

				const fullPath = normalize(decodedUrl)

				// 路径白名单校验：解析后的路径必须位于应用临时目录内
				const baseDir = getTempBaseDir()
				const rel = relative(baseDir, fullPath)
				if (rel.startsWith('..') || isAbsolute(rel)) {
					return new Response('Forbidden', { status: 403 })
				}

				const data = await fs.readFile(fullPath)
				return new Response(data)
			} catch {
				return new Response('Not Found', { status: 404 })
			}
		})
	})

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	})
}
