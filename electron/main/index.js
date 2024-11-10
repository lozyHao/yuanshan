// src-electron/main.js
import { app, BrowserWindow, ipcMain } from "electron";
import createWindow from "./windowCreator.js";
import start from "./eventHandler.js";


// 准备完成调用创建方法
app.whenReady().then(() => {
	ipcMain.on("ping", () => console.log("pong"));
	createWindow();

	// 启动事件监听
	start()

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") app.quit();
	})
});
