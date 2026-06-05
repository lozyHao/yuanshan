import { getUUID } from '@renderer/utils/uuid'
import ExifFactory from './exifFactory'
import {
	ImageTextItem,
	OptionBasicValues,
	OutputStatusEnum,
	TextPositionValues,
	TextTemplatePositionEnum
} from '@renderer/interfaces/options'

type TextList = { [key: string]: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] }
type DrawParams = { basic: OptionBasicValues; textList: TextList }
type OutputResult = { url: Blob; outputFormat: string }
type DrawCallback = (result: number | OutputResult) => void

class ImageData {
	key: string
	file: File | null
	filename: string
	perUrl: string // 原图预览地址
	outerUrl: string | null // 输出预览地址
	exif: ExifFactory // 元数据对象

	preLoading: boolean = false // 预览图更新中
	progress: number = 0 // 预览进度
	outputPercent: number = 0 // 输出进度
	outputStatus: OutputStatusEnum = OutputStatusEnum.NO // 输出状态

	constructor(file: File) {
		this.file = file
		this.filename = file.name
		this.key = getUUID()
		this.perUrl = this.getPerUrl()
		this.outerUrl = null
		this.exif = new ExifFactory(file)

		this.preLoading = false
	}

	getPerUrl(): string {
		return this.file ? URL.createObjectURL(this.file) : ''
	}

	/**
	 * 将当前文件解码为 ImageBitmap，并在解码完成后释放临时 objectURL，避免内存泄漏。
	 * startPreview / startOutput 共用此逻辑。
	 */
	private async loadBitmap(): Promise<{ imageBitmap: ImageBitmap; width: number; height: number }> {
		const src = URL.createObjectURL(this.file as File)
		try {
			const img = new Image()
			img.src = src
			await new Promise<void>((resolve, reject) => {
				img.onload = () => resolve()
				img.onerror = () => reject(new Error('图片加载失败'))
			})
			const imageBitmap = await createImageBitmap(img)
			return {
				imageBitmap,
				width: imageBitmap.width || img.width,
				height: imageBitmap.height || img.height
			}
		} finally {
			URL.revokeObjectURL(src)
		}
	}

	/** 输出 */
	async onPrint(params: DrawParams, textPosition: TextPositionValues, type: string = 'preview') {
		if (type === 'preview') {
			await this.startPreview({ ...params, textPosition })
		} else {
			await this.startOutput({ ...params, textPosition })
		}
	}

	// 开始绘制预览
	async startPreview(params: DrawParams & { textPosition: TextPositionValues }) {
		this.progress = 0
		this.preLoading = true

		const { imageBitmap, width, height } = await this.loadBitmap()
		this.progress = 20

		// 解析参数，避免存在对象
		const currentParams = {
			basic: { ...params.basic },
			textList: { ...params.textList }
		}

		await this.outPut(
			currentParams,
			imageBitmap,
			width,
			height,
			'preview',
			currentParams.basic.outputQuality,
			params.textPosition,
			(result) => {
				if (typeof result === 'number') {
					this.progress = result
				} else {
					// 释放上一张预览图，避免每次重绘累积 blob
					if (this.outerUrl) URL.revokeObjectURL(this.outerUrl)
					this.outerUrl = URL.createObjectURL(result.url)
					this.preLoading = false
				}
			}
		)
	}

	// 开始输出
	async startOutput(params: DrawParams & { textPosition: TextPositionValues }) {
		this.outputPercent = 0
		this.outputStatus = OutputStatusEnum.LOADING

		const { imageBitmap, width, height } = await this.loadBitmap()
		this.outputPercent = 20

		// 解析参数，避免存在对象
		const currentParams = {
			basic: { ...params.basic },
			textList: { ...params.textList }
		}

		return await new Promise((resolve) => {
			this.outPut(
				currentParams,
				imageBitmap,
				width,
				height,
				'output',
				currentParams.basic.outputQuality,
				params.textPosition,
				async (message) => {
					if (typeof message === 'number') {
						this.outputPercent = message
						return
					}

					const arrayBuffer = await blobToArrayBuffer(message.url)
					if (!arrayBuffer) {
						this.outputStatus = OutputStatusEnum.FAIL
						this.outputPercent = 100
						resolve(null)
						return
					}

					this.outputStatus = OutputStatusEnum.SAVE
					const result = await window.api.sendSaveFile({
						imageArrayBuffer: arrayBuffer,
						dir: params.basic.outputPath,
						outputFormat: message.outputFormat
					})
					this.outputStatus = result ? OutputStatusEnum.SUCCESS : OutputStatusEnum.FAIL
					this.outputPercent = 100
					resolve(result)
				}
			)
		})
	}

	// 输出工具
	async outPut(
		params: DrawParams,
		image: ImageBitmap,
		width: number,
		height: number,
		type: string = 'preview',
		quality: number = 90,
		textPosition: TextPositionValues,
		callback: DrawCallback
	) {
		const { basic, textList } = params

		width = parseFloat(((width * quality) / 100).toFixed(4))
		height = parseFloat(((height * quality) / 100).toFixed(4))

		// 判断是否有内容绘制
		const haveText =
			textList &&
			(textList.left.length > 0 || textList.right.length > 0 || textList.center.length > 0)

		const CanvasDraw = await import('./canvasDraw')
		const canvasDraw = new CanvasDraw.default(
			width,
			height,
			basic.textBgColorUsed,
			basic.borderWidth,
			basic.borderSize,
			haveText
		)

		// 绘制背景图 / 纯色背景
		if (basic.bgColorUsed) {
			canvasDraw.drawColorBackground({ color: basic.bgColor })
		} else {
			canvasDraw.drawBlurImage({ image, width: undefined, height: undefined, blur: basic.bgBlur })
		}
		callback(40)

		// 绘制主图
		canvasDraw.drawMainImage({
			image,
			width,
			height,
			shadow: basic.shadowSize,
			radius: basic.roundedSize
		})
		callback(50)

		// 绘制边框
		if (basic.textBgColorUsed) {
			canvasDraw.drawTextBackground({ color: basic.textBgColor })
		}
		callback(60)

		// TODO: 绘制水印
		if (basic.watermarkUsed && basic.watermark) {
			canvasDraw.drawWatermark({
				image: basic.watermark,
				size: basic.watermarkSize,
				position: basic.watermarkPosition
			})
		}
		callback(70)

		// 绘制某一侧（左/中/右）的文字，单条时 y=0，多条时按序号定位
		const drawSide = (
			side: { items: ImageTextItem[] }[],
			x: 'left' | 'center' | 'right',
			positionOptions: [number, number, number]
		) => {
			for (let i = 0; i < side.length; i++) {
				canvasDraw.drawItems({
					items: side[i].items,
					x,
					y: side.length === 1 ? 0 : i + 1,
					positionOptions
				})
			}
		}

		// 绘制文字：左、中、右
		drawSide(textList.left, 'left', textPosition.headerTextPosition)
		callback(80)
		drawSide(textList.center, 'center', textPosition.middleTextPosition)
		callback(90)
		drawSide(textList.right, 'right', textPosition.footerTextPosition)

		const imageDataURL: Blob = await canvasDraw.getBlob({
			type: basic.outputFormat,
			quality: quality / 100
		})
		callback(type === 'preview' ? 100 : 95)

		callback({ url: imageDataURL, outputFormat: basic.outputFormat })
	}

	// 恢复默认
	restoreDefault() {
		this.preLoading = false
		this.progress = 0
		this.outputPercent = 0
		this.outputStatus = OutputStatusEnum.NO
	}

	// 释放占用的 objectURL，移除文件时调用，避免内存泄漏
	dispose() {
		if (this.perUrl) URL.revokeObjectURL(this.perUrl)
		if (this.outerUrl) URL.revokeObjectURL(this.outerUrl)
		this.outerUrl = null
	}
}

// 转换成 ArrayBuffer
function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer | null> {
	return new Promise((resolve) => {
		const reader = new FileReader()
		reader.readAsArrayBuffer(blob)
		reader.onload = () => {
			resolve(reader.result as ArrayBuffer)
		}
		reader.onerror = () => {
			resolve(null)
		}
	})
}

export default ImageData
