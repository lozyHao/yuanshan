import { ipcMain, dialog, shell } from 'electron';
import path from 'path';
import fs from 'fs';
import { Buffer } from 'buffer';

import taskQueueManager from './taskQueueManager.js';

const start = () => {
	ipcMain.handle('dialog:openFile', handleFileOpen);
	ipcMain.handle('dialog:openFileMulti', handleFileOpenMulti);
	ipcMain.handle('dialog:openFileDirectory', handleFileOpenDirectory);

	ipcMain.on('dialog:openFileDirectoryByPath', handleFileOpenDirectoryByPath);
	ipcMain.on('files-to-save', handleSaveFiles);
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


// 保存文件
const handleSaveFiles = async (event, base64DataList) => {
	base64DataList.forEach((data, index) => {
		const task = saveFile(data, index, event);
		taskQueueManager.addTask(task);
	});
}

// 保存文件的函数
const saveFile = (data, index, event) => {
	return new Promise((resolve, reject) => {
		const filePath = path.join('path/', `${index}.png`);
		const buffer = Buffer.from(data.split(',')[1], 'base64');
		fs.writeFile(filePath, buffer, (err) => {
			if (err) {
				event.reply('file-save-result', {
					message: `文件${index}保存失败: ${err.message}`,
					type: 'error'
				});
				reject(err);
			} else {
				event.reply('file-save-result', {
					message: `文件${index}保存成功`,
					type: 'success'
				});
				resolve();
			}
		});
	});
};

// 监听所有任务完成事件
taskQueueManager.on('allTasksCompleted', () => {
	console.log('所有任务完成');

	ipcMain.send('file-save-result', {
		message: `文件保存结束`,
		type: 'end'
	});
});

export default start;