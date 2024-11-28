import { app, ipcMain, dialog, shell } from 'electron'
import path from 'path'
import fs from 'fs'

const start = () => {
	console.log('eventHandler')
	ipcMain.handle('dialog:openFile', handleFileOpen)
	ipcMain.handle('dialog:openFileMulti', handleFileOpenMulti)
	ipcMain.handle('dialog:openFileDirectory', handleFileOpenDirectory)

	ipcMain.on('dialog:openFileDirectoryByPath', handleFileOpenDirectoryByPath)
	ipcMain.handle('files-to-save', async (_event, params) => await handleSaveFiles(params))
}

// 事件处理

/** 单文件选择 */
const handleFileOpen = async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ['openFile']
	})

	if (canceled) {
		return { status: false, msg: '已取消', fileDir: [] }
	}

	// 获取应用的安装目录路径
	const appPath = app.getPath('appData') // 或者使用 'userData'，取决于您的需求
	const tempDir = path.join(appPath, 'yuanshan/temp')
	// 确保临时目录存在
	await fs.promises.mkdir(tempDir, { recursive: true })

	try {
		const uploadedFiles = await Promise.all(
			filePaths.map(async (srcPath) => {
				const fileName = path.basename(srcPath)
				const destPath = path.join(tempDir, fileName)
				await fs.promises.copyFile(srcPath, destPath)
				return destPath
			})
		)

		return { status: true, msg: '成功', fileDir: uploadedFiles }
	} catch (error: any) {
		return { status: false, msg: '失败', fileDir: null }
	}
}

/** 多文件选择 */
const handleFileOpenMulti = async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ['openFile', 'multiSelections'] // 允许选择多个文件
	})
	if (!canceled) {
		return filePaths
	}
	return null
}

/** 选择文件目录 */
const handleFileOpenDirectory = async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ['openDirectory']
	})
	if (!canceled) {
		return filePaths
	}
	return null
}

// 打开文件夹，根据定位路径打开文件管理
const handleFileOpenDirectoryByPath = async (_event, filePath: string) => {
	shell.openPath(filePath)
}

// 保存文件
const handleSaveFiles = async (params: {
	imageArrayBuffer: ArrayBuffer
	width: number
	height: number
	dir: string
	quality: number
}) => {
	const { imageArrayBuffer, dir } = params

	//   确保临时目录存在
	if (!fs.existsSync(dir)) {
		await fs.promises.mkdir(dir, { recursive: true })
	}

	// eslint-disable-next-line no-async-promise-executor
	return await new Promise(async (resolve) => {
		const fileName = Date.now() + '.png'
		try {
			await fs.promises.writeFile(dir + '/' + fileName, Buffer.from(imageArrayBuffer), 'binary')
			resolve(true)
		} catch (error) {
			resolve(false)
		}
	})
}

export default start
