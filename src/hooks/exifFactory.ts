import * as Exifreader from "exifreader";

interface ExifData {
	// 不能用any
	[key: string]: unknown;
}

class ExifFactory {
	file: File;
	exif: ExifData;

	constructor(file: File) {
		this.file = file;
		this.exif = {};

		// 获取exif
		this.load(file);
	}

	// 获取图片的exif信息
	async load(file: File): Promise<ExifData> {
		const exif: ExifData = await Exifreader.load(file);
		const result = this.getExifData(exif);
		return result;
	}

	// exif解析需要的数据
	getExifData(exif: ExifData): ExifData {
		// TODO: 数据解析
		return exif;
	}
}

export default ExifFactory;
