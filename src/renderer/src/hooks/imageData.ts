import { getUUID } from '@renderer/utils/uuid'
import ExifFactory from './exifFactory'
import {
	ImageTextItem,
	OptionBasicValues,
	OutputStatusEnum,
	TextPositionValues,
	TextTemplatePositionEnum
} from '@renderer/interfaces/options'

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

	/** 输出 */
	async onPrint(
		params: {
			basic: OptionBasicValues
			textList: { [key: string]: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] }
		},
		textPosition: TextPositionValues,
		type: string = 'preview',
	) {
		if (type === 'preview') {
			await this.startPreview({ ...params, textPosition })
		} else {
			await this.startOutput({ ...params, textPosition })
		}
	}

	// 开始绘制预览
	async startPreview(params: {
		basic: OptionBasicValues
		textList: { [key: string]: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] }
		textPosition: TextPositionValues
	}) {
		this.progress = 0
		this.preLoading = true

		const img = new Image()
		const src = URL.createObjectURL(this.file as File)
		img.src = src

		img.onload = async () => {
			// blob 转 imageBitmap
			const imageBitmap = await createImageBitmap(img)
			const { width, height } = imageBitmap
			this.progress = 20

			// 解析参数，避免存在对象
			const currentParams = {
				basic: { ...params.basic },
				textList: { ...params.textList }
			}
			this.outPut(
				currentParams,
				imageBitmap,
				width ?? img.width,
				height ?? img.height,
				'preview',
				currentParams.basic.outputQuality,
				params.textPosition,
				(result: number | Blob) => {
					console.log(`${this.filename} 进度：`, result)
					if (typeof result === 'number') {
						this.progress = result
					} else {
						this.outerUrl = URL.createObjectURL(result)
						this.preLoading = false
					}
				}
			)
		}
	}

	// 开始输出
	async startOutput(params: {
		basic: OptionBasicValues
		textList: { [key: string]: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] }
		textPosition: TextPositionValues
	}) {
		const img = new Image()
		const src = URL.createObjectURL(this.file as File)
		img.src = src

		return await new Promise((resolve) => {
			this.outputPercent = 0
			this.outputStatus = OutputStatusEnum.LOADING
			img.onload = async () => {
				// blob 转 imageBitmap
				const imageBitmap = await createImageBitmap(img)
				const { width, height } = imageBitmap
				this.outputPercent = 20

				// 解析参数，避免存在对象
				const currentParams = {
					basic: { ...params.basic },
					textList: { ...params.textList }
				}


				this.outPut(
					currentParams,
					imageBitmap,
					width ?? img.width,
					height ?? img.height,
					'output',
					currentParams.basic.outputQuality,
					params.textPosition,
					async (message: number | Blob) => {
						if (typeof message === 'number') {
							this.outputPercent = message
						} else {
							const arrayBuffer = await blobToArrayBuffer(message)

							if (!arrayBuffer) resolve(null)
							this.outputStatus = OutputStatusEnum.SAVE
							const result = await (window.api as any).sendSaveFile({
								imageArrayBuffer: arrayBuffer,
								dir: params.basic.outputPath,
							})
							if (result) {
								this.outputStatus = OutputStatusEnum.SUCCESS
							} else {
								this.outputStatus = OutputStatusEnum.FAIL
							}

							this.outputPercent = 100
							resolve(result)
						}
					}
				)
			}
		})
	}

	// 输出工具
	async outPut(
		params: any,
		image: ImageBitmap,
		width: number,
		height: number,
		type: string = 'preview',
		quality: number = 90,
		textPosition: TextPositionValues,
		callback: (result: number | Blob) => void
	) {
		const { basic, textList } = params

		width = parseFloat((width * quality / 100).toFixed(4))
		height = parseFloat((height * quality / 100).toFixed(4))

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

		// 绘制文字
		// 绘制左侧
		if (textList.left.length) {
			for (let i = 0; i < textList.left.length; i++) {
				const item = textList.left[i]
				canvasDraw.drawItems({
					items: item.items,
					x: 'left',
					y: textList.left.length === 1 ? 0 : i + 1,
					positionOptions: textPosition.headerTextPosition
				})
			}
		}
		callback(80)
		// 绘制中间
		if (textList.center.length) {
			for (let i = 0; i < textList.center.length; i++) {
				const item = textList.center[i]
				canvasDraw.drawItems({
					items: item.items,
					x: 'center',
					y: textList.center.length === 1 ? 0 : i + 1,
					positionOptions: textPosition.middleTextPosition
				})
			}
		}
		callback(90)
		// 绘制右侧
		if (textList.right.length) {
			for (let i = 0; i < textList.right.length; i++) {
				const item = textList.right[i]
				canvasDraw.drawItems({
					items: item.items,
					x: 'right',
					y: textList.right.length === 1 ? 0 : i + 1,
					positionOptions: textPosition.footerTextPosition
				})
			}
		}

		console.log(basic.outputFormat, quality)
		const imageDataURL: Blob = await canvasDraw.getBlob({ type: basic.outputFormat, quality: quality / 100 })
		if (type === 'preview') {
			callback(100)
		} else {
			callback(95)
		}

		callback(imageDataURL)
	}


	// 恢复默认
	restoreDefault() {
		this.preLoading = false
		this.progress = 0
		this.outputPercent = 0
		this.outputStatus = OutputStatusEnum.NO
	}
}





// 转换成 ArrayBuffer
function blobToArrayBuffer(blob: Blob) {
	return new Promise((resolve) => {
		const reader = new FileReader()
		reader.readAsArrayBuffer(blob)
		reader.onload = () => {
			resolve(reader.result)
		}
		reader.onerror = () => {
			resolve(null)
		}
	})
}

export default ImageData
