import { WatermarkPositionEnum } from '@renderer/interfaces/options'

type Position = 'center' | 'left' | 'right'

type ImageBitmap = {
	height: number
	width: number
	close: () => void
}

// 绘制纯色
type FillRectType = {
	color?: string
	width?: number
	height?: number
	x?: number
	y?: number
}

// 绘制文字
type FileTextType = {
	text: string
	font?: string
	size: number
	color: string
	italic: boolean
	bold: boolean
	textAlign?: 'left' | 'center' | 'right'
	x: number
	y: number
}

// 绘制图片
type DrawImageType = {
	image: ImageBitmap // 解析的 imageBitmap
	width: number
	height: number
	x: number
	y: number
}

// 绘制纯色文字背景
type FillRectTextType = {
	color?: string
	width?: number
	height?: number
	x?: number
	y?: number
}

// 绘制高斯模糊图片
type BlurImageType = {
	image: ImageBitmap // 解析的 imageBitmap
	width?: number
	height?: number
	x?: number
	y?: number
	blur?: number
}

// 绘制主图（圆角+投影）
type DrawMainImageType = {
	image: ImageBitmap // 解析的 imageBitmap
	width?: number
	height?: number
	ratio?: number // 图占比 50-100
	radius?: [number, number, number, number] // 圆角 0-50
	shadow?: number // 阴影 0.1-1
}

// 图文结合绘制
type ImageTextItem = {
	type: number // 0 文字 1 图片
	content: ImageBitmap | string
	width?: number
	height?: number
	size: number // 字号/图片尺寸 0.2 - 0.9
	font?: string
	color: string
	italic?: boolean
	bold?: boolean
}

// 水印绘制
type WatermarkType = {
	image: ImageBitmap // 解析的 imageBitmap
	size?: number // 字号/图片尺寸 0.2 - 0.9
	position?: WatermarkPositionEnum // 水印位置
}

type ImageTextType = {
	items: ImageTextItem[]
	x: Position
	y: number // 0 仅仅一个 1 两个-第一个 2 两个-第二个
	positionOptions: [number, number, number] // 文本对齐中线位置
}

/** canvas 绘制相关 */
class CanvasDraw {
	canvas: OffscreenCanvas
	ctx: OffscreenCanvasRenderingContext2D
	width: number = 1200 // 宽度
	height: number = 1600 // 高度
	minSize: number = 1200 // 宽和高中，最小尺寸，用于计算 文字和图片的大小

	border: boolean = false // 是否有边框绘制了纯色
	ratio: number = 90 // 图占比
	borderWidth: [number, number, number, number] = [5, 5, 5, 5] // 副边框
	borderSize: number = 10 // 主边框
	haveText: boolean = true // 是否有文字绘制

	constructor(
		width: number,
		height: number,
		border: boolean = false,
		borderWidth: [number, number, number, number] = [5, 5, 5, 5],
		borderSize: number = 10,
		haveText: boolean = true
	) {
		this.minSize = Math.min(width, height)
		this.border = border
		this.borderWidth = borderWidth
		this.borderSize = borderSize
		this.haveText = haveText

		console.log("边框：", borderWidth, borderSize, "图片：", width, height)
		this.width = width + this.minSize * ((borderWidth[1] + borderWidth[3]) / 100)
		this.height = height + this.minSize * ((borderWidth[0] + borderWidth[2]) / 100)
		if (haveText) {
			this.height += this.minSize * (borderSize / 100)
		}

		console.log("输出大小：", this.width, this.height)

		this.canvas = new OffscreenCanvas(this.width, this.height)
		this.ctx = this.canvas.getContext('2d') as OffscreenCanvasRenderingContext2D

		if (!this.ctx) {
			throw new Error('获取画布上下文失败')
		}
	}

	/**
	 * 清屏
	 */
	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height)
	}

	/**
	 * 绘制纯色盒子
	 * @param options  配置
	 */
	drawColorBackground(options: FillRectType) {
		const { color = '#ffffff', width = this.width, height = this.height, x = 0, y = 0 } = options

		this.ctx.fillStyle = color
		this.ctx.fillRect(x, y, width, height)
	}

	/**
	 * 绘制文字
	 * @param options 配置
	 */
	drawText(options: FileTextType) {
		const {
			text,
			font = 'Arial',
			x,
			y,
			color = '#000000',
			size = 40,
			bold = false,
			textAlign = 'left',
			italic = false
		} = options
		this.ctx.save()
		this.ctx.fillStyle = color
		console.log('绘制的字体', font)
		this.ctx.font = `${italic ? 'italic ' : ''} ${bold ? 'bold' : ''} ${size}px ${font}`
		this.ctx.textAlign = textAlign
		this.ctx.textBaseline = 'middle'
		this.ctx.fillText(text, x, y)
		this.ctx.restore()
	}

	/**
	 * 绘制图片
	 * @param options 配置
	 */
	drawImage(options: DrawImageType) {
		const { image, width, height, x = 0, y = 0 } = options

		this.ctx.drawImage(image, x, y, width, height)
	}

	// 组合使用
	/**
	 * 绘制纯色文字背景
	 * @param options 配置
	 */
	drawTextBackground(options: FillRectTextType) {
		const {
			color = '#ffffff',
			width = this.width,
			height = this.minSize * (this.borderSize / 100),
			x = 0,
			y = this.height - this.minSize * (this.borderSize / 100)
		} = options

		this.drawColorBackground({
			color,
			width,
			height,
			x,
			y
		})
	}
	/**
	 * 绘制图片高斯模糊
	 * @param options 配置
	 */
	drawBlurImage(options: BlurImageType) {
		const { image, width = this.width, height = this.height, x = 0, y = 0, blur = 60 } = options

		// 保存原始上下文状态
		this.ctx.save();
		// 预填充背景色（关键步骤）
		this.ctx.fillStyle = "#FFFFFF"; // 根据实际背景色修改
		this.ctx.fillRect(x, y, width, height);
		// 扩展绘制区域（模糊补偿）

		// 扩大绘制范围（坐标偏移 + 尺寸扩展）
		for (let i = 3; i >0; i--) {
			const blurCompensation = blur * (i * 2); // 模糊扩散补偿量
			this.ctx.filter = `blur(${blur}px)`;
			this.ctx.drawImage(
				image,
				x - blurCompensation / 2,          // X 偏移补偿
				y - blurCompensation / 2,          // Y 偏移补偿
				width + blurCompensation,        // 绘制宽度扩展
				height + blurCompensation        // 绘制高度扩展
			);
		}
		this.ctx.filter = `blur(${blur}px)`;
		this.ctx.drawImage(
			image,
			x - blur / 2,          // X 偏移补偿
			y - blur / 2,          // Y 偏移补偿
			width + blur,        // 绘制宽度扩展
			height + blur        // 绘制高度扩展
		);
		this.ctx.filter = 'none';

		// 恢复上下文状态
		this.ctx.restore();
	}

	/**
	 * 绘制主图
	 * @param options 配置
	 */
	drawMainImage(options: DrawMainImageType) {
		const {
			image,
			width = this.width,
			height = this.height,
			shadow = 0.5,
			radius = [5, 5, 5, 5]
		} = options

		const currentShadow = (shadow * this.minSize) / 10
		const currentRadius = radius.map((item: number) => item > 0 ? ((item / 100) * this.minSize) : 0)

		const bx = this.minSize * (this.borderWidth[3] / 100)
		const by = this.minSize * (this.borderWidth[0] / 100)

		this.ctx.save()
		// 绘制投影
		if (this.ratio < 100) {
			this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
			this.ctx.shadowBlur = currentShadow
			this.ctx.shadowOffsetX = 0
			this.ctx.shadowOffsetY = 0
		}

		// 绘制圆角矩形
		this.ctx.beginPath()
		this.ctx.roundRect(bx, by, width, height, currentRadius)
		this.ctx.fill()
		this.ctx.clip()

		this.ctx.drawImage(image, bx, by, width, height)
		this.ctx.restore()
	}

	/**
	 * 绘制图片和文本列表，并确保它们整体水平居中
	 * @param items 图片和文本配置数组
	 */
	drawItems(options: ImageTextType) {
		const { items, x = 'center', y, positionOptions } = options
		let totalWidth = 0
		let maxHeight = 0

		const borderHeight = this.minSize * (this.borderSize / 100)

		const bl = (this.borderWidth[3]) / 100
		const br = (this.borderWidth[1]) / 100
		const by = 0

		// 计算绘制的位置
		let yPosition = this.height * (1 - by) - positionOptions[1] * borderHeight
		if (y === 1) {
			yPosition = this.height * (1 - by) - positionOptions[2] * borderHeight
		} else if (y === 2) {
			yPosition = this.height * (1 - by) - positionOptions[0] * borderHeight
		}

		// 首先计算所有元素的总宽度和最大高度
		for (let i = 0; i < items.length; i++) {
			const item = items[i]
			if (item.type === 1) {
				// 图片
				const content = item.content as ImageBitmap
				const h = borderHeight * item.size
				const w = content.width * (h / content.height)

				if (i === items.length - 1) {
					totalWidth += w
				} else {
					totalWidth += w + borderHeight * 0.1
				}

				maxHeight = Math.max(maxHeight, h)
			} else {
				// 文本
				const fontSize = borderHeight * item.size * 1.2

				const width = this.measureTextWidth(
					item.content as string,
					fontSize,
					item.font as string,
					item.bold as boolean,
					item.italic as boolean
				)

				if (i === items.length - 1) {
					totalWidth += width
				} else {
					totalWidth += width + borderHeight * 0.1
				}

				maxHeight = Math.max(maxHeight, fontSize)
			}
		}
		let currentX: number = this.minSize * bl
		switch (x) {
			case 'center':
				currentX = (this.width - totalWidth) / 2
				break
			case 'left':
				currentX = this.minSize * bl
				break
			case 'right':
				currentX = this.width - this.minSize * br - totalWidth
				break
			default:
				currentX = (this.width - totalWidth) / 2
		}

		// 然后根据计算出的总宽度和最大高度绘制每个元素
		for (let i = 0; i < items.length; i++) {
			const item = items[i]

			if (item.type === 1) {
				// 图片
				const content = item.content as ImageBitmap
				const h = borderHeight * item.size
				const w = content.width * (h / content.height)

				this.ctx.drawImage(content, currentX, yPosition - h / 2, w, h)

				if (i === items.length - 1) {
					currentX += w
				} else {
					currentX += w + borderHeight * 0.1
				}
			} else {
				// 文本
				const fontSize = borderHeight * item.size * 1.2
				const textWidth = this.measureTextWidth(
					item.content as string,
					fontSize,
					item.font as string,
					item.bold as boolean,
					item.italic as boolean
				)

				this.drawText({
					text: item.content as string,
					x: currentX,
					y: yPosition,
					font: item.font,
					color: item.color || '#000000',
					size: fontSize,
					bold: item.bold || false,
					italic: item.italic || false
				})

				if (i === items.length - 1) {
					currentX += textWidth
				} else {
					currentX += textWidth + borderHeight * 0.1
				}
			}
		}
	}

	/**
	 * 绘制水印
	 * @param text 水印文本
	 */
	drawWatermark(options: WatermarkType) {
		const { image, size = 0.4, position } = options

		if (!image) return

		// 计算出水印的宽高
		let borderHeight = this.minSize * (this.borderSize / 100)

		const h = size * borderHeight
		const w = (h / image.height) * image.width

		if (!this.haveText) {
			// 如果没有文本，就不需要减去边框高度
			borderHeight = 0
		}

		// 根据 position 计算出水印的起始位置 x，y
		let x = (this.width - w) / 2
		let y = (this.height - borderHeight) / 2 - h
		switch (position) {
			case 'top':
				x = (this.width - w) / 2
				y = (this.height - borderHeight) * ((1 - this.ratio / 100) / 2) + h
				break
			case 'bottom':
				x = (this.width - w) / 2
				y =
					(this.height - borderHeight) * (this.ratio / 100) +
					(this.height - borderHeight) * ((1 - this.ratio / 100) / 2) -
					1.5 * h
				break
			case 'leftTop':
				x = this.width * ((1 - this.ratio / 100) / 2) + h
				y = (this.height - borderHeight) * ((1 - this.ratio / 100) / 2) + h
				break
			case 'leftBottom':
				x = this.width * ((1 - this.ratio / 100) / 2) + h
				y =
					(this.height - borderHeight) * (this.ratio / 100) +
					(this.height - borderHeight) * ((1 - this.ratio / 100) / 2) -
					1.5 * h
				break
			case 'rightTop':
				x = this.width - this.width * ((1 - this.ratio / 100) / 2) - w - h
				y = (this.height - borderHeight) * ((1 - this.ratio / 100) / 2) + h
				break
			case 'rightBottom':
				x = this.width - this.width * ((1 - this.ratio / 100) / 2) - w - h
				y =
					(this.height - borderHeight) * (this.ratio / 100) +
					(this.height - borderHeight) * ((1 - this.ratio / 100) / 2) -
					1.5 * h
				break
			default:
				// 默认底部居中
				break
		}

		this.ctx.drawImage(image, x, y, w, h)
	}

	/**
	 * 获取canvas blob
	 */
	async getBlob(params: { type?: string; quality?: number }) {
		const { type = 'image/jpg', quality = 0.9 } = params
		return await this.canvas.convertToBlob({ type, quality })
	}

	/**
	 * 获取 ImageBitmap
	 */
	async getImageBitmap() {
		return this.canvas.transferToImageBitmap()
	}

	/**
	 * 动态计算文本宽度
	 * @param text 文本内容
	 * @param fontSize 字体大小
	 * @param font 字体
	 */
	private measureTextWidth(
		text: string,
		fontSize: number,
		font: string,
		bold: boolean = false,
		italic: boolean = false
	): number {
		this.ctx.font = `${italic ? 'italic ' : ''} ${bold ? 'bold' : ''} ${fontSize}px ${font}`
		const metrics = this.ctx.measureText(text)
		return metrics.width
	}
}

export default CanvasDraw
