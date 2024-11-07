import * as Exifreader from "exifreader";

import { exifFields } from "@/default/default-options";


interface Exif {
	// 不能用any
	[key: string]: {
		id?: number,
		value?: string | [],
		description: string
	};
}

interface ExifData {
	[key: string]: string | null
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
		const exif: Exif = await Exifreader.load(file);

		const result: ExifData = this.getExif(exif);
		this.exif = result;
		return result;
	}

	// exif解析需要的数据
	getExif(exif: Exif): ExifData {
		// 数据解析
		const exifData: ExifData = {};

		for (let i = 0; i < exifFields.length; i++) {
			const key = exifFields[i].key

			// 校验这个key在exif上是否存在
			if (Object.prototype.hasOwnProperty.call(exif, key)) {
				exifData[key] = exif[key]?.description || null;
			} else {
				exifData[key] = null;
			}
		}
		return exifData;
	}


	// 获取对应的数据
	get(key: string) {
		const data = this.exif[key];
		if (key === 'Image Height' || key === 'Image Width') {
			return Number(data);
		}
		if (key === 'Make') {
			// 去掉第一个空格之后的内容 NIKON CORPORATION => NIKON
			return data?.split(' ')[0];
		}
		if (key === 'Model') {
			// 去掉第一个空格之前的内容 NIKON Z 6_2 => Z 6_2
			return data?.replace(data?.split(' ')[0] + ' ', '');
		}
		if (key === 'FocalLength') {
			// 去掉空格 56 mm => 56mm
			return data?.replace(' ', '');
		}
		return data;
	}
}

export default ExifFactory;
