const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
	openFile: () => ipcRenderer.invoke('dialog:openFile'),
	openFileMulti: () => ipcRenderer.invoke('dialog:openFileMulti'),
	openFileDirectory: () => ipcRenderer.invoke('dialog:openFileDirectory'),
	openFileDirectoryByPath: (filePath) => ipcRenderer.send('dialog:openFileDirectoryByPath', filePath)
})