/**
 * 照片边框
 */
// 基础配置
export enum OptionBasicEnum {
	OUTPUT_PATH = 'outputPath', // 输出目录
	PATTERN = 'pattern', // 模式
	MAIN_IMG_SIZE = 'mainImgSize', // 主图尺寸
	TEXT_BG_COLOR = 'textBgColor', // 文字背景
	TEXT_BG_COLOR_USED = 'textBgColorUsed', // 文字背景是否启用
	WATERMARK = 'watermark', // 图片水印
	WATERMARK_POSITION = 'watermarkPosition', // 水印位置
	WATERMARK_USED = 'watermarkUsed', // 水印是否启用
	WATERMARK_SIZE = 'watermarkSize', // 水印尺寸
	ROUNDED_SIZE = 'roundedSize', // 圆角
	SHADOW_SIZE = 'shadowSize', // 阴影大小
	BG_COLOR = 'bgColor', // 背景颜色纯色
	BG_COLOR_USED = 'bgColorUsed', // 背景颜色是否启用
	BG_BLUR = 'bgBlur', // 背景模糊
	ASPECT_RATIO_USED = 'aspectRatioUsed', // 长宽比是否启用
	OUTPUT_QUALITY = 'outputQuality' // 输出质量
}

export interface OptionBasicValues {
	[OptionBasicEnum.OUTPUT_PATH]: string | null
	[OptionBasicEnum.PATTERN]: OptionPatternEnum
	[OptionBasicEnum.MAIN_IMG_SIZE]: number
	[OptionBasicEnum.TEXT_BG_COLOR]: string
	[OptionBasicEnum.TEXT_BG_COLOR_USED]: boolean
	[OptionBasicEnum.WATERMARK]?: ImageBitmap | string | null
	[OptionBasicEnum.WATERMARK_POSITION]?: WatermarkPositionEnum
	[OptionBasicEnum.WATERMARK_USED]?: boolean
	[OptionBasicEnum.WATERMARK_SIZE]?: number
	[OptionBasicEnum.ROUNDED_SIZE]: number
	[OptionBasicEnum.SHADOW_SIZE]: number
	[OptionBasicEnum.BG_COLOR]?: string
	[OptionBasicEnum.BG_COLOR_USED]?: boolean
	[OptionBasicEnum.BG_BLUR]?: number
	[OptionBasicEnum.ASPECT_RATIO_USED]?: boolean
	[OptionBasicEnum.OUTPUT_QUALITY]?: number
}

// 文字模板
export enum OptionTextTemplateEnum {
	KEY = 'key', // 标识
	TYPE = 'type', // 类型 0-系统 1-自定义
	NAME = 'name', // 名称
	CONTENT = 'content', // 内容
	FONT = 'font', // 字体
	SIZE = 'size', // 字号
	COLOR = 'color', // 颜色
	ITALIC = 'italic', // 斜体
	BOLD = 'bold', // 粗体
	position = 'position' // 位置
}

export interface OptionTextTemplateValues {
	[OptionTextTemplateEnum.KEY]: string | null
	[OptionTextTemplateEnum.TYPE]: number
	[OptionTextTemplateEnum.NAME]: string | null
	[OptionTextTemplateEnum.CONTENT]: Array<string> | null
	[OptionTextTemplateEnum.FONT]: string
	[OptionTextTemplateEnum.SIZE]: number
	[OptionTextTemplateEnum.COLOR]: string
	[OptionTextTemplateEnum.ITALIC]: boolean
	[OptionTextTemplateEnum.BOLD]: boolean
	[OptionTextTemplateEnum.position]: TextTemplatePositionEnum
}

// 相机参数
export enum OptionLensEnum {
	KEY = 'key', // 标识
	TYPE = 'type', // 类型 0-系统 1-自定义
	NAME = 'name', // 名称
	CONTENT_TYPE = 'contentType', // 内容类型 0-文本 1-图片
	CONTENT_TEXT = 'contentText', // 文本
	CONTENT_IMAGE = 'contentImage', // 图片
	FONT = 'font', // 字体
	SIZE = 'size', // 字号
	COLOR = 'color', // 颜色
	ITALIC = 'italic', // 斜体
	BOLD = 'bold', // 粗体
	USED = 'used', // 是否启用
	FORCED_USED = 'forcedUsed', // 强制使用
	DESCRIPTION = 'description', // 描述/填充模板内容
	SHOW = 'show' // 是否显示
}

export interface OptionLensValues {
	[OptionLensEnum.KEY]: string | null
	[OptionLensEnum.TYPE]: number
	[OptionLensEnum.NAME]: string | null
	[OptionLensEnum.CONTENT_TYPE]?: number
	[OptionLensEnum.CONTENT_TEXT]?: string | null
	[OptionLensEnum.CONTENT_IMAGE]?: string | null
	[OptionLensEnum.FONT]?: string | null
	[OptionLensEnum.SIZE]?: number | null
	[OptionLensEnum.COLOR]?: string | null
	[OptionLensEnum.ITALIC]?: boolean | null
	[OptionLensEnum.BOLD]?: boolean | null
	[OptionLensEnum.USED]?: boolean | null
	[OptionLensEnum.FORCED_USED]?: boolean | null
	[OptionLensEnum.DESCRIPTION]: string | null
	[OptionLensEnum.SHOW]?: boolean | null
}

/**
 * 其他
 */
// 模式
export enum OptionPatternEnum {
	OUT = 'out',
	IN = 'in'
}

// 水印位置
export enum WatermarkPositionEnum {
	TOP = 'top',
	BOTTOM = 'bottom',
	LEFT_TOP = 'leftTop',
	LEFT_BOTTOM = 'leftBottom',
	RIGHT_TOP = 'rightTop',
	RIGHT_BOTTOM = 'rightBottom',
	CENTER = 'center'
}

// 文本模板位置
export enum TextTemplatePositionEnum {
	HEADER = 'left',
	MIDDLE = 'center',
	FOOTER = 'right',
	NO = 'no'
}

// 宽高比
export enum AspectRatioEnum {
	ASPECT_4_3 = '4/3',
	ASPECT_16_9 = '16/9',
	ASPECT_3_4 = '3/4',
	ASPECT_9_16 = '9/16',
	ASPECT_1_1 = '1/1'
}

// 模板添加消息
export interface ResultMessage {
	status: number
	msg: string
}

// iconSize
export enum IconSize {
	Mini = 'tiny',
	Small = 'small',
	Medium = 'medium',
	Large = 'large'
}

/** canvas 绘制方法参数配置 */
export type Position = 'center' | 'left' | 'right'
export type Mode = 'in' | 'out' // 模式（边框所在位置，内侧还是外侧）

export type ImageBitmap = {
	height: number
	width: number
	close: () => void
}

// 绘制纯色
export type FillRectType = {
	color?: string
	width: number
	height: number
	x?: number
	y?: number
}

// 绘制文字
export type FileTextType = {
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
export type DrawImageType = {
	image: ImageBitmap // 解析的 imageBitmap
	width: number
	height: number
	x: number
	y: number
}

// 绘制高斯模糊图片
export type BlurImageType = {
	image: ImageBitmap // 解析的 imageBitmap
	width?: number
	height?: number
	x?: number
	y?: number
	blur?: number
}

// 绘制主图（圆角+投影）
export type DrawMainImageType = {
	image: ImageBitmap // 解析的 imageBitmap
	width?: number
	height?: number
	ratio?: number // 图占比 50-100
	radius?: number // 圆角 0-50
	shadow?: number // 阴影 0.1-1
}

// 图文结合绘制
export type ImageTextItem = {
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
export type ImageTextType = {
	items: ImageTextItem[]
	x: Position
	yPosition: number
}

// 输出状态
export enum OutputStatusEnum {
	NO = 'no', // 未处理
	LOADING = 'loading', // 处理中
	SAVE = 'save', // 保存
	SUCCESS = 'success', // 成功
	FAIL = 'fail' // 失败
}
