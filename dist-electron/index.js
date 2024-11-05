import { BrowserWindow, app, ipcMain, dialog, shell } from "electron";
import path, { dirname, join } from "path";
import fs from "fs";
const currentFilePath = dirname(new URL(import.meta.url).pathname);
const createWindow = () => {
  let win = new BrowserWindow({
    width: 1080,
    height: 600,
    minWidth: 1080,
    minHeight: 600,
    title: "远 山",
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(app.getAppPath(), "/electron/preload/index.js")
    }
  });
  win.representedFilename = "../../public/favicon.ico";
  win.once("ready-to-show", () => {
    win.show();
  });
  console.log(process.env.VITE_DEV_SERVER_URL);
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(currentFilePath, "../dist/index.html"));
  }
  return win;
};
const start = () => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("dialog:openFileMulti", handleFileOpenMulti);
  ipcMain.handle("dialog:openFileDirectory", handleFileOpenDirectory);
  ipcMain.on("dialog:openFileDirectoryByPath", handleFileOpenDirectoryByPath);
};
const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    const dir = "temp/";
    const savedPaths = await saveFilesToDirectory(filePaths, dir);
    return savedPaths;
  }
};
const handleFileOpenMulti = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"]
    // 允许选择多个文件
  });
  if (!canceled) {
    return filePaths;
  }
};
const handleFileOpenDirectory = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"]
  });
  if (!canceled) {
    return filePaths;
  }
  return null;
};
const handleFileOpenDirectoryByPath = async (event, filePath) => {
  console.log(event, filePath);
  shell.showItemInFolder(filePath);
};
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
app.whenReady().then(() => {
  ipcMain.on("ping", () => console.log("pong"));
  createWindow();
  start();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
