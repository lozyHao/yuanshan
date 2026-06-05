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
		// 源头拦截：值缺失时直接返回 null，避免被前缀/拼接成 "ISOnull"、"NaN" 等再绘制上去
		if (data === null || data === undefined || data === '') {
			return null
		}
		if (key === 'Image Height' || key === 'Image Width') {
			return Number(data?.replace('px', ''))
		}
		if (key === 'Make') {
			// 去掉第一个空格之后的内容 NIKON CORPORATION => NIKON
			return data?.split(' ')[0]
		}
		if (key === 'Model') {
			const make = (this.exif['Make'] || '').toUpperCase()
			const firstToken = data.split(' ')[0]
			let result = data
			// 仅当型号开头确实是品牌名时才去掉品牌前缀，避免误删型号本身（如富士 X-T5、索尼 ZV-E10）
			if (firstToken && make.includes(firstToken.toUpperCase())) {
				result = data.slice(firstToken.length).trimStart()
			}
			// 下划线转间隔点：Z 6_2 => Z 6·2
			result = result.replace(/_/g, '·')
			// 尼康 Z 系列风格化——仅对尼康生效，不影响其它品牌型号中的 Z
			if (make.includes('NIKON')) {
				result = result.replace(/[Zz]/g, 'ℤ')
			}
			return result
		}
		if (key === 'FocalLength') {
			// 去掉空格 56 mm => 56mm
			return data?.replace(' ', '')
		}
		if (key === 'ISOSpeedRatings') {
			// 100 => ISO100
			return `ISO${data}`
		}
		if (key === 'LensModel') {
			// 去除镜头厂商
			return data?.replace(data?.split(' ')[0] + ' ', '')
		}
		return data
	}
}

export default ExifFactory
