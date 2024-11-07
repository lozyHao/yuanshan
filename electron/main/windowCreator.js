import { BrowserWindow, app } from "electron";
import { join, dirname } from 'path';

// 获取当前文件的目录路径
const currentFilePath = dirname(new URL(import.meta.url).pathname);

// 创建浏览器窗口时，调用这个函数。
const createWindow = () => {
	let win = new BrowserWindow({
		width: 1080,
		height: 600,
		minWidth: 1080,
		minHeight: 640,
		show: false,
		// frame: false,
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: '#ffffff00',
			symbolColor: '#999',
			height: 40

		},
		autoHideMenuBar: true,
		webPreferences: {
			preload: join(app.getAppPath(), '/electron/preload/index.js')
		}
	});

	win.once("ready-to-show", () => {
		win.show();
	});

	// win.loadURL('http://localhost:3000')
	// development模式
	console.log(process.env.VITE_DEV_SERVER_URL)
	if (process.env.VITE_DEV_SERVER_URL) {
		win.loadURL(process.env.VITE_DEV_SERVER_URL);
		// 开启调试台
		win.webContents.openDevTools();
	} else {
		win.loadFile(join(currentFilePath, "../dist/index.html"));
	}
	return win;
};


export default createWindow