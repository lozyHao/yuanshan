import { ElectronAPI } from '@electron-toolkit/preload'

// 单文件选择结果（主进程 dialog:openFile 返回）
export interface FileOpenResult {
  status: boolean
  msg: string
  fileDir: string[] | null
}

// 保存文件参数
export interface SaveFileParams {
  imageArrayBuffer: ArrayBuffer
  dir: string | null
  outputFormat: string
}

// 渲染进程可用的主进程 API（见 src/preload/index.ts）
export interface Api {
  openFile: () => Promise<FileOpenResult>
  openFileMulti: () => Promise<string[] | null>
  openFileDirectory: () => Promise<string[] | null>
  openFileDirectoryByPath: (filePath: string) => void
  sendSaveFile: (params: SaveFileParams) => Promise<boolean>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
