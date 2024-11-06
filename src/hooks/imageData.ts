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

	startPreview() {
		this.preLoading = true;
		console.log('exif', this.exif)
		this.handleDrawStart(this.file as File).then((url: string) => {
			this.perUrl = url;
			this.preLoading = false;
		})

	}

	/**
	 * 绘制开始
	 * 通过配置和exif 替换对应的模板，设置样式
	 * 计算绘制的宽高（文字、边框、主图大小、背景模糊、纯色背景、文字背景、边框高度、边框模式）
	 */
	async handleDrawStart(file: File): Promise<string> {
		const img = new Image();
		img.src = URL.createObjectURL(file);
		return await new Promise((resolve) => {
			img.onload = async () => {
				const bigSize = Math.min(img.width, img.height) * 0.03 // 字体大小、图片高度
				const smallSize = Math.min(img.width, img.height) * 0.02 // 字体大小、图片高度

				const canvasDraw = new CanvasDraw(img.width * 0.5, img.height * 0.5);
				// 绘制背景图
				await canvasDraw.drawBlurImage(file as File, img.width * 0.5, img.height * 0.5)
				// 绘制主图
				await canvasDraw.drawMainImage(file as File, img.width * 0.5, img.height * 0.5)

				// 绘制白底边框
				// canvasDraw.drawColorBackground('#ffffff', 0, img.height * 0.5, img.width * 0.5, img.height * 0.5 * 0.15);
				// 绘制文字
				// const imageDataURL: string = canvasDraw.drawText("Nikon", 'Arial', img.width * 0.25, img.height * 0.55, "#000000", img.height * 0.55 * 0.06, 'bold', 'center')

				// 绘制文字
				canvasDraw.drawText("Nikon", 'Arial', img.width * 0.025, img.height * 0.5 + Math.min(img.width, img.height) * 0.02, "#ffffff", bigSize, 'bold', 'left')
				const imageDataURL = canvasDraw.drawText("135mm f/1.8 200s ISO200", 'Arial', img.width * 0.475, img.height * 0.5 + Math.min(img.width, img.height) * 0.02, "#ffffff", smallSize, 'normal', 'right')

				resolve(imageDataURL); // imageDataURL
			}
		})
	}

	/**
	 * 导出开始
	 */
}

export default ImageData;