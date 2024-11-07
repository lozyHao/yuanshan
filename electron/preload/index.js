const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	openFile: () => ipcRenderer.invoke('dialog:openFile'),
	openFileMulti: () => ipcRenderer.invoke('dialog:openFileMulti'),
	openFileDirectory: () => ipcRenderer.invoke('dialog:openFileDirectory'),
	openFileDirectoryByPath: (filePath) => ipcRenderer.send('dialog:openFileDirectoryByPath', filePath),
	sendSaveFile: (value) => ipcRenderer.send('files-to-save', value),
	getSaveFileResult: (callback) => ipcRenderer.on('file-save-result', (_event, value) => callback(value)),
})