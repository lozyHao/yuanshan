// src-electron/main.js
import { app, BrowserWindow, ipcMain } from "electron";

import createWindow from "./windowCreator.js";
import start from "./eventHandler.js";

// Electron 会在初始化后并准备
app.whenReady().then(() => {
	ipcMain.on("ping", () => console.log("pong"));
	createWindow();
	start()
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
