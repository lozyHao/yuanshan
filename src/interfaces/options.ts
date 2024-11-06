// 通用配置
export enum OptionDefaultEnum {
	// 通用配置
	OUTPUT_PATH = "outputPath", // 输出目录
}

export interface OptionDefaultValues {
	[OptionDefaultEnum.OUTPUT_PATH]: string;
}

/**
 * 照片边框
 */
// 基础配置
export enum OptionBasicEnum {
	PATTERN = "pattern", // 模式
	MAIN_IMG_SIZE = "mainImgSize", // 主图尺寸
	TEXT_BG_COLOR = "textBgColor", // 文字背景
	TEXT_BG_COLOR_USED = "textBgColorUsed", // 文字背景是否启用
	WATERMARK = "watermark", // 图片水印
	WATERMARK_POSITION = "watermarkPosition", // 水印位置
	WATERMARK_USED = "watermarkUsed", // 水印是否启用
	ROUNDED_SIZE = "roundedSize", // 圆角
	SHADOW_SIZE = "shadowSize", // 阴影大小
	BG_COLOR = "bgColor", // 背景颜色纯色
	BG_COLOR_USED = "bgColorUsed", // 背景颜色是否启用
	BG_BLUR = "bgBlur", // 背景模糊
	ASPECT_RATIO = "aspectRatio", // 长宽比
	ASPECT_RATIO_USED = "aspectRatioUsed", // 长宽比是否启用
	OUTPUT_QUALITY = "outputQuality", // 输出质量
}

export interface OptionBasicValues {
	[OptionBasicEnum.PATTERN]: OptionPatternEnum;
	[OptionBasicEnum.MAIN_IMG_SIZE]: number;
	[OptionBasicEnum.TEXT_BG_COLOR]: string;
	[OptionBasicEnum.TEXT_BG_COLOR_USED]: boolean;
	[OptionBasicEnum.WATERMARK]?: string | null;
	[OptionBasicEnum.WATERMARK_POSITION]?: WatermarkPositionEnum;
	[OptionBasicEnum.WATERMARK_USED]?: boolean;
	[OptionBasicEnum.ROUNDED_SIZE]: number;
	[OptionBasicEnum.SHADOW_SIZE]: number;
	[OptionBasicEnum.BG_COLOR]?: string;
	[OptionBasicEnum.BG_COLOR_USED]?: boolean;
	[OptionBasicEnum.BG_BLUR]?: number;
	[OptionBasicEnum.ASPECT_RATIO]?: AspectRatioEnum;
	[OptionBasicEnum.ASPECT_RATIO_USED]?: boolean;
	[OptionBasicEnum.OUTPUT_QUALITY]?: number;
}

// 文字模板
export enum OptionTextTemplateEnum {
	KEY = "key", // 标识
	TYPE = "type", // 类型 0-系统 1-自定义
	NAME = "name", // 名称
	CONTENT = "content", // 内容
	FONT = "font", // 字体
	SIZE = "size", // 字号
	COLOR = "color", // 颜色
	ITALIC = "italic", // 斜体
	BOLD = "bold", // 粗体
	position = "position", // 位置
}

export interface OptionTextTemplateValues {
	[OptionTextTemplateEnum.KEY]: string;
	[OptionTextTemplateEnum.TYPE]: number;
	[OptionTextTemplateEnum.NAME]: string;
	[OptionTextTemplateEnum.CONTENT]?: string;
	[OptionTextTemplateEnum.FONT]?: string;
	[OptionTextTemplateEnum.SIZE]?: number;
	[OptionTextTemplateEnum.COLOR]?: string;
	[OptionTextTemplateEnum.ITALIC]?: boolean;
	[OptionTextTemplateEnum.BOLD]?: boolean;
	[OptionTextTemplateEnum.position]: TextTemplatePositionEnum;
}

// 相机参数
export enum OptionLensEnum {
	KEY = "key", // 标识
	TYPE = "type", // 类型 0-系统 1-自定义
	NAME = "name", // 名称
	CONTENT_TYPE = "contentType", // 内容类型 0-文本 1-图片
	CONTENT_TEXT = "contentText", // 文本
	CONTENT_IMAGE = "contentImage", // 图片
	FORCED_USED = "forcedUsed", // 强制使用
	FONT = "font", // 字体
	FONT_USED = "fontUsed", // 字体是否启用
	SIZE = "size", // 字号
	COLOR = "color", // 颜色
	ITALIC = "italic", // 斜体
	BOLD = "bold", // 粗体
	USED = "used", // 是否启用
	DISCRIPTION = "description", // 描述/填充模板内容
}

export interface OptionLensValues {
	[OptionLensEnum.KEY]: string;
	[OptionLensEnum.TYPE]: number;
	[OptionLensEnum.NAME]: string | null;
	[OptionLensEnum.CONTENT_TYPE]?: number;
	[OptionLensEnum.CONTENT_TEXT]?: string | null;
	[OptionLensEnum.CONTENT_IMAGE]?: File | null;
	[OptionLensEnum.FORCED_USED]: boolean;
	[OptionLensEnum.FONT]?: string | null;
	[OptionLensEnum.FONT_USED]?: boolean;
	[OptionLensEnum.SIZE]?: number;
	[OptionLensEnum.COLOR]?: string;
	[OptionLensEnum.ITALIC]?: boolean;
	[OptionLensEnum.BOLD]?: boolean;
	[OptionLensEnum.USED]?: boolean;
	[OptionLensEnum.DISCRIPTION]?: string;
}

/**
 * 其他
 */
// 模式
export enum OptionPatternEnum {
	OUT = "out",
	IN = "in",
}

// 水印位置
export enum WatermarkPositionEnum {
	TOP = "top",
	BOTTOM = "bottom",
	LEFT_TOP = "leftTop",
	LEFT_BOTTOM = "leftBottom",
	RIGHT_TOP = "rightTop",
	RIGHT_BOTTOM = "rightBottom",
	CENTER = "center",
}

// 文本模板位置
export enum TextTemplatePositionEnum {
	HEADER = "header",
	MIDDLE = "middle",
	FOOTER = "footer",
	NO = "no",
}

// 宽高比
export enum AspectRatioEnum {
	ASPECT_4_3 = "4/3",
	ASPECT_16_9 = "16/9",
	ASPECT_3_4 = "3/4",
	ASPECT_9_16 = "9/16",
	ASPECT_1_1 = "1/1",
}

// 模板添加消息
export interface ResultMessage {
	status: number;
	msg: string;
}

// iconSize
export enum IconSize {
	Mini = 'tiny',
	Small = 'small',
	Medium = 'medium',
	Large = 'large'
}