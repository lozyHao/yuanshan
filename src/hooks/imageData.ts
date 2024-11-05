import { getUUID } from "@/utils/uuid";

import ExifFactory from "./exifFactory";

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
		setTimeout(() => {
			this.preLoading = false;
		}, 2000);
	}
}

export default ImageData;