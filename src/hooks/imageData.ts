import { getUUID } from "@/utils/uuid";

import ExifFactory from "./exifFactory";
import CanvasDraw from "./canvasDraw";

class ImageData {
	key: string;
	file: File | null;
	filename: string;
	perUrl: string; // 原图预览地址
	outerUrl: string | null; // 输出预览地址
	exif: ExifFactory; // 元数据对象

	preLoading: boolean = false; // 预览图更新中

	constructor(file: File) {
		this.file = file;
		this.filename = file.name;
		this.key = getUUID();
		this.perUrl = this.getPerUrl();
		this.outerUrl = null;
		this.exif = new ExifFactory(file);

		this.preLoading = false;
	}

	getPerUrl(): string {
		return this.file ? URL.createObjectURL(this.file) : '';
	}

	async startPreview() {
		this.handleDrawStart(this.file as File);
	}

	/**
	 * 绘制开始
	 * 通过配置和exif 替换对应的模板，设置样式
	 * 计算绘制的宽高（文字、边框、主图大小、背景模糊、纯色背景、文字背景、边框高度、边框模式）
	 */
	handleDrawStart(file: File) {
		this.preLoading = true;
		const img = new Image();
		img.src = URL.createObjectURL(file);
		img.onload = async () => {
			const bigSize = Math.min(img.width, img.height) * 0.03 // 字体大小、图片高度
			const smallSize = Math.min(img.width, img.height) * 0.02 // 字体大小、图片高度

			const canvasDraw = new CanvasDraw(img.width * 0.5, img.height * 0.5);
			// 绘制背景图
			await canvasDraw.drawBlurImage(img.src, img.width * 0.5, img.height * 0.5)
			// // 绘制主图
			// await canvasDraw.drawMainImage(img.src, img.width * 0.5, img.height * 0.5)
			// 绘制文字
			canvasDraw.drawText("Nikon", 'Arial', img.width * 0.025, img.height * 0.5 + Math.min(img.width, img.height) * 0.02, "#ffffff", bigSize, 'bold', 'left')
			const url = canvasDraw.drawText("135mm f/1.8 200s ISO200", 'Arial', img.width * 0.475, img.height * 0.5 + Math.min(img.width, img.height) * 0.02, "#ffffff", smallSize, 'normal', 'right')

			this.perUrl = url;
			this.preLoading = false;
		}
	}

	/**
	 * 导出开始
	 */
}

export default ImageData;
