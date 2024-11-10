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

// 字体文件列表
export const fontOptions = [
	{ label: "默认字体", value: "Wen", key: "/src/assets/font/Wen.TTF" },
	{ label: "方圆体", value: "AliFY", key: "/src/assets/font/AliFY.ttf" },
	{ label: "刀隶体", value: "AliDLi", key: "/src/assets/font/AliDLi.ttf" },
	{ label: "灵动体", value: "AliAgile", key: "/src/assets/font/AliAgile.ttf" },
]

// 默认文字参数
export const defaultOptions = {
	fontColor: "#ffffff",
	fontSize: 0.35,
	fontBold: false,
	fontItalic: false,
	fontFamily: fontOptions[0].value,
	defaultDir: "C:\\Program Files\\yuanshan"
}

// 默认相机参数
export const exifFields: OptionLensValues[] = [
	{ key: "Make", name: "Logo", type: 0, used: true, description: "{Logo}", show: true },
	{ key: "Model", name: "型号", type: 0, used: true, description: "{型号}", show: true },
	{ key: "LensMake", name: "镜头Logo", type: 0, used: true, description: "{镜头Logo}", show: true },
	{ key: "LensModel", name: "镜头型号", type: 0, used: true, description: "{镜头型号}", show: true },
	{ key: "ExposureTime", name: "快门", type: 0, used: true, description: "{快门}s", show: true },
	{ key: "FNumber", name: "光圈", type: 0, used: true, description: "f/{光圈}", show: true },
	{ key: "ISOSpeedRatings", name: "ISO", type: 0, used: true, description: "{ISO}", show: true },
	{ key: "FocalLength", name: "焦距", type: 0, used: true, description: "{焦距}mm", show: true },
	{ key: "FocalLengthIn35mmFilm", name: "等效焦距", type: 0, used: true, description: "{等效焦距}mm", show: true },
	{ key: "ExposureProgram", name: "档位", type: 0, used: true, description: "{档位}", show: true },
	{ key: "ExposureMode", name: "曝光补偿", type: 0, used: true, description: "{曝光补偿}", show: true },
	{ key: "MeteringMode", name: "测光模式", type: 0, used: true, description: "{测光模式}", show: true },
	{ key: "WhiteBalance", name: "白平衡", type: 0, used: true, description: "{白平衡}", show: true },
	{ key: "DateTimeOriginal", name: "拍摄日期", type: 0, used: true, description: "{拍摄日期}", show: true },
	{ key: "Image Height", name: "图片高度", type: 0, used: true, description: "{高度}", show: false },
	{ key: "Image Width", name: "图片宽度", type: 0, used: true, description: "{宽度}", show: false },
];

// 默认文本模板
export const defTextTemps: OptionTextTemplateValues[] = [
	{
		key: "Logo 型号",
		name: "Logo 型号",
		type: 0,
		content: [
			"Make",
			'Model'
		],
		font: defaultOptions.fontFamily,
		size: 0.4,
		color: defaultOptions.fontColor,
		italic: true,
		bold: true,
		position: TextTemplatePositionEnum.MIDDLE,
	},
	{
		key: "镜头logo型号",
		name: "镜头logo型号",
		type: 0,
		content: ["FocalLength", 'FNumber', 'ExposureTime', 'ISOSpeedRatings'],
		font: defaultOptions.fontFamily,
		size: 0.3,
		color: defaultOptions.fontColor,
		italic: defaultOptions.fontItalic,
		bold: defaultOptions.fontBold,
		position: TextTemplatePositionEnum.MIDDLE
	},
];


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

// 相机品牌 logo 列表（name:名称、value: 图标路径）
export const cameraBrandOptions = [
	{ label: "xmage", value: "/mark_logo/xmage.png" },
	{ label: "xmage-w", value: "/mark_logo/xmage-w.png" },
	{ label: "xmage-b", value: "/mark_logo/xmage-b.png" },
	{ label: "Canon", value: "/mark_logo/canon.png" },
	{ label: "Canon-W", value: "/mark_logo/canon-w.png" },
	{ label: "Canon-b", value: "/mark_logo/canon-b.png" },
	{ label: "Nikon", value: "/mark_logo/nikon.png" },
	{ label: "Nikon-w", value: "/mark_logo/nikon-w.png" },
	{ label: "Nikon-b", value: "/mark_logo/nikon-b.png" },
	{ label: "sony-w", value: "/mark_logo/sony-w.png" },
	{ label: "sony-b", value: "/mark_logo/sony-b.png" },
	{ label: "panasonic-w", value: "/mark_logo/panasonic-w.png" },
	{ label: "panasonic-b", value: "/mark_logo/panasonic-b.png" },
	{ label: "fujifilm-w", value: "/mark_logo/fujifilm-w.png" },
	{ label: "fujifilm-b", value: "/mark_logo/fujifilm-b.png" },
	{ label: "olympus", value: "/mark_logo/olympus.png" },
	{ label: "olympus-w", value: "/mark_logo/olympus-w.png" },
	{ label: "olympus-b", value: "/mark_logo/olympus-b.png" },
	{ label: "leica", value: "/mark_logo/leica.png" },
	{ label: "leica-w", value: "/mark_logo/leica-w.png" },
	{ label: "leica-b", value: "/mark_logo/leica-b.png" },
	{ label: "zeiss", value: "/mark_logo/zeiss.png" },
	{ label: "zeiss-w", value: "/mark_logo/zeiss-w.png" },
	{ label: "zeiss-b", value: "/mark_logo/zeiss-b.png" },
	{ label: "hasselblad-w", value: "/mark_logo/hasselblad-w.png" },
	{ label: "hasselblad-b", value: "/mark_logo/hasselblad-b.png" },
	{ label: "dji-w", value: "/mark_logo/dji-w.png" },
	{ label: "dji-b", value: "/mark_logo/dji-b.png" },
	{ label: "songdian-w", value: "/mark_logo/songdian-w.png" },
	{ label: "songdian-b", value: "/mark_logo/songdian-b.png" },
	{ label: "pentax-w", value: "/mark_logo/pentax-w.png" },
	{ label: "pentax-b", value: "/mark_logo/pentax-b.png" },
	{ label: "ricoh-w", value: "/mark_logo/ricoh-w.png" },
	{ label: "ricoh-b", value: "/mark_logo/ricoh-b.png" },
	{ label: "sigma-w", value: "/mark_logo/sigma-w.png" },
	{ label: "sigma-b", value: "/mark_logo/sigma-b.png" },
]