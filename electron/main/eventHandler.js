import { ipcMain, dialog, shell } from 'electron';
import path from 'path';
import fs from 'fs';

const start = () => {
	ipcMain.handle('dialog:openFile', handleFileOpen);
	ipcMain.handle('dialog:openFileMulti', handleFileOpenMulti);
	ipcMain.handle('dialog:openFileDirectory', handleFileOpenDirectory);
	ipcMain.on('dialog:openFileDirectoryByPath', handleFileOpenDirectoryByPath);
}


// 事件处理

/** 单文件选择 */
const handleFileOpen = async () => {
	const { canceled, filePaths } = await dialog.showOpenDialog()
	if (!canceled) {
		// TODO: 将文件存储在本地指定目录，并返回文件路径（绝对路径）
		const dir = 'temp/'
		// 存储文件到项目目录下的temp目录
		// 修改文件名称，拼接时间戳
		const savedPaths = await saveFilesToDirectory(filePaths, dir);
		return savedPaths;
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
const handleFileOpenDirectoryByPath = async (event, filePath) => {
	console.log(event, filePath)
	shell.showItemInFolder(filePath)
}

// 保存文件到指定目录并返回保存后的绝对路径
async function saveFilesToDirectory(filePaths, directory) {
	const savedPaths = [];
	for (const filePath of filePaths) {
		const fileName = path.basename(filePath);
		const destPath = path.join(directory, fileName);

		await fs.promises.copyFile(filePath, destPath);
		savedPaths.push(destPath);
	}
	return savedPaths;
}

export default start 