/** 默认的配置项 */
import modal01 from "@/assets/images/modal01.png";
import modal02 from "@/assets/images/modal02.png";

import {
	OptionLensValues,
	OptionTextTemplateValues,
	TextTemplatePositionEnum,
	OptionPatternEnum,
	WatermarkPositionEnum
} from "@/interfaces/options.ts";

// 默认相机参数
export const exifFields: OptionLensValues[] = [
	{ key: "Make", name: "Logo", type: 0, used: true, description: "{Logo}" },
	{ key: "Model", name: "型号", type: 0, used: true, description: "{型号}" },
	{ key: "LensMake", name: "镜头Logo", type: 0, used: true, description: "{镜头Logo}" },
	{ key: "LensModel", name: "镜头型号", type: 0, used: true, description: "{镜头型号}" },
	{ key: "ExposureTime", name: "快门", type: 0, used: true, description: "{快门}s" },
	{ key: "FNumber", name: "光圈", type: 0, used: true, description: "f/{光圈}" },
	{ key: "ISO", name: "ISO", type: 0, used: true, description: "{ISO}" },
	{ key: "FocalLength", name: "焦距", type: 0, used: true, description: "{焦距}mm" },
	{ key: "FocalLengthIn35mmFormat", name: "等效焦距", type: 0, used: true, description: "{等效焦距}mm" },
	{ key: "ExposureProgram", name: "档位", type: 0, used: true, description: "{档位}" },
	{ key: "DateTimeOriginal", name: "拍摄日期", type: 0, used: true, description: "{拍摄日期}" },
	{ key: "ExposureCompensation", name: "曝光补偿", type: 0, used: true, description: "{曝光补偿}" },
	{ key: "MeteringMode", name: "测光模式", type: 0, used: true, description: "{测光模式}" },
	{ key: "WhiteBalance", name: "白平衡", type: 0, used: true, description: "{白平衡}" },
];

// 默认文本模板
export const defTextTemps: OptionTextTemplateValues[] = [
	{
		key: "Logo 型号",
		name: "Logo 型号",
		type: 0,
		content: "{Logo} {型号}",
		position: TextTemplatePositionEnum.FOOTER
	},
	{
		key: "镜头logo型号",
		name: "镜头logo型号",
		type: 0,
		content: "{焦距}mm f/{光圈} {快门}s ISO{ISO}",
		position: TextTemplatePositionEnum.FOOTER
	},
];


// 字体文件列表
export const fontOptions = [
	{ label: "方圆体", value: "../assets/font/AliFY.ttf" },
	{ label: "刀隶体", value: "../assets/font/AliDLi.ttf" },
	{ label: "灵动体", value: "../assets/font/AliAgile.ttf" },
]

// 模式
export const modalOptions = [
	{
		key: OptionPatternEnum.OUT,
		img: modal01,
	},
	{
		key: OptionPatternEnum.IN,
		img: modal02,
	},
];

// 水印位置
export const watermarkPositionOptions = [
	{
		label: "顶部",
		value: WatermarkPositionEnum.TOP,
	},
	{
		label: "中间",
		value: WatermarkPositionEnum.CENTER,
	},
	{
		label: "底部",
		value: WatermarkPositionEnum.BOTTOM,
	},
	{
		label: "左上",
		value: WatermarkPositionEnum.LEFT_TOP,
	},
	{
		label: "右上",
		value: WatermarkPositionEnum.RIGHT_TOP,
	},
	{
		label: "左下",
		value: WatermarkPositionEnum.LEFT_BOTTOM,
	},
	{
		label: "右下",
		value: WatermarkPositionEnum.RIGHT_BOTTOM,
	},
];


// 默认文字参数
export const defaultOptions = {
	fontColor: "#000000",
	fontSize: 20,
	fontBold: false,
	fontItalic: false,
	fontFamily: fontOptions[0].value,
	defaultDir: "C:\\Program Files\\yuanshan"
}