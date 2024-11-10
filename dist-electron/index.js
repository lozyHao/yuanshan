var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { BrowserWindow, app, ipcMain, dialog, shell } from "electron";
import path, { dirname, join } from "path";
import fs from "fs";
import { Buffer as Buffer2 } from "buffer";
import EventEmitter from "events";
const currentFilePath = dirname(new URL(import.meta.url).pathname);
const createWindow = () => {
  let win = new BrowserWindow({
    width: 1080,
    height: 600,
    minWidth: 1080,
    minHeight: 640,
    icon: join(app.getAppPath(), "/electron/assets/logo.png"),
    show: false,
    // frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#ffffff00",
      symbolColor: "#999",
      height: 40
    },
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(app.getAppPath(), "/electron/preload/index.js")
    }
  });
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
class Semaphore {
  constructor(permits) {
    __publicField(this, "permits");
    __publicField(this, "promiseResolverQueue");
    this.permits = permits;
  }
  async wait() {
    if (this.permits > 0) {
      this.permits -= 1;
      return Promise.resolve(true);
    }
    return new Promise((resolver) => this.promiseResolverQueue.push(resolver));
  }
  async acquire() {
    return this.wait();
  }
  signal() {
    this.permits += 1;
    if (this.permits > 1 && this.promiseResolverQueue.length > 0) {
      console.warn("Semaphore.permits should never be > 0 when there is someone waiting.");
    } else if (this.permits === 1 && this.promiseResolverQueue.length > 0) {
      this.permits -= 1;
      const nextResolver = this.promiseResolverQueue.shift();
      if (nextResolver) {
        nextResolver(true);
      }
    }
  }
  release() {
    this.signal();
  }
}
class TaskQueueManager extends EventEmitter {
  constructor(maxConcurrentTasks) {
    super();
    this.tasks = [];
    this.semaphore = new Semaphore(maxConcurrentTasks);
    this.isProcessing = false;
  }
  addTask(task) {
    this.tasks.push(task);
    if (this.tasks.length === 1) {
      this.processNextTask();
    }
  }
  async processNextTask() {
    if (this.tasks.length === 0) return;
    const task = this.tasks.shift();
    await this.semaphore.acquire();
    this.isProcessing = true;
    try {
      await task();
    } finally {
      this.semaphore.release();
      this.isProcessing = false;
      if (this.tasks.length > 0) {
        this.processNextTask();
      } else {
        this.allTasksCompleted();
      }
    }
  }
  allTasksCompleted() {
    this.emit("allTasksCompleted");
  }
}
const taskQueueManager = new TaskQueueManager(5);
const start = () => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("dialog:openFileMulti", handleFileOpenMulti);
  ipcMain.handle("dialog:openFileDirectory", handleFileOpenDirectory);
  ipcMain.on("dialog:openFileDirectoryByPath", handleFileOpenDirectoryByPath);
  ipcMain.on("files-to-save", handleSaveFiles);
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
const handleSaveFiles = async (event, base64DataList) => {
  base64DataList.forEach((data, index) => {
    const task = saveFile(data, index, event);
    taskQueueManager.addTask(task);
  });
};
const saveFile = (data, index, event) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join("path/", `${index}.png`);
    const buffer = Buffer2.from(data.split(",")[1], "base64");
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        event.reply("file-save-result", {
          message: `文件${index}保存失败: ${err.message}`,
          type: "error"
        });
        reject(err);
      } else {
        event.reply("file-save-result", {
          message: `文件${index}保存成功`,
          type: "success"
        });
        resolve();
      }
    });
  });
};
taskQueueManager.on("allTasksCompleted", () => {
  console.log("所有任务完成");
  ipcMain.send("file-save-result", {
    message: `文件保存结束`,
    type: "end"
  });
});
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
