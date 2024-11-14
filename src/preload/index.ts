import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  openFileMulti: () => ipcRenderer.invoke('dialog:openFileMulti'),
  openFileDirectory: () => ipcRenderer.invoke('dialog:openFileDirectory'),

  openFileDirectoryByPath: (filePath: string) =>
    ipcRenderer.send('dialog:openFileDirectoryByPath', filePath),

  sendSaveFile: (params: {
    imageArrayBuffer: ArrayBuffer
    width: number
    height: number
    dir: string
    quality: number
  }) => ipcRenderer.invoke('files-to-save', params)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', { ...api })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
