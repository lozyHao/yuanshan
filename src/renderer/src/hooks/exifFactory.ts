import * as Exifreader from 'exifreader'

import { exifFields } from '@renderer/default/default-options'

export interface Exif {
	// 不能用any
	[key: string]: {
		id?: number
		value?: string | []
		description: string
	}
}

export interface ExifData {
	[key: string]: string | null
}

class ExifFactory {
	file: File
	exif: ExifData
	// EXIF 加载完成的 Promise，消费方应先 await 再读取，避免读到空数据
	ready: Promise<ExifData>

	constructor(file: File) {
		this.file = file
		this.exif = {}

		// 获取exif
		this.ready = this.load(file)
	}

	// 获取图片的exif信息
	async load(file: File): Promise<ExifData> {
		try {
			const exif: Exif = await Exifreader.load(file)
			const result: ExifData = this.getExif(exif)
			this.exif = result
			return result
		} catch {
			// 无 EXIF 或解析失败时返回空数据，不阻塞后续流程
			this.exif = {}
			return this.exif
		}
	}

	// exif解析需要的数据
	getExif(exif: Exif): ExifData {
		// 数据解析
		const exifData: ExifData = {}

		for (let i = 0; i < exifFields.length; i++) {
			const key = exifFields[i].key
			if (!key) {
				continue
			}
			// 校验这个key在exif上是否存在
			if (Object.prototype.hasOwnProperty.call(exif, key)) {
				exifData[key] = exif[key]?.description || null
			} else {
				exifData[key] = null
			}
		}
		return exifData
	}

	// 将exif 数据格式化 {名称，值}
	getExifJSON(exif: ExifData): { name: string; value: string }[] {
		const list: { name: string; value: string }[] = []
		for (const key in exif) {
			const e = exifFields.find((item) => item.key === key)
			if (e) {
				list.push({
					name: e.name as string,
					value: this.get(key) as string
				})
			}
		}
		return list
	}

	// 获取对应的数据
	get(key: string) {
		const data = this.exif[key]
		// 值缺失时返回 null，避免被拼接成 "ISOnull" 等再绘制上去
		if (data === null || data === undefined || data === '') {
			return null
		}
		if (key === 'Image Height' || key === 'Image Width') {
			return Number(data?.replace('px', ''))
		}
		if (key === 'Model') {
			const make = (this.exif['Make'] || '').toUpperCase()
			// 保留型号原文（不去除品牌前缀），仅做风格化处理
			let result = data.trim()
			// 尼康 Z 系列风格化（Z => ℤ）——尼康机型才生效，避免影响其它品牌型号中的 Z
			if (make.includes('NIKON') || result.toUpperCase().includes('NIKON')) {
				result = result.replace(/[Zz]/g, 'ℤ')
			}
			return result
		}
		// 仅 ISO 加前缀：100 => ISO100
		if (key === 'ISOSpeedRatings') {
			return `ISO${data}`
		}
		// 其余字段原样返回
		return data
	}
}

export default ExifFactory
