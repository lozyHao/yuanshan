/**
 * 通用配置
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import {
	OptionBasicValues,
	OptionBasicEnum,
	WatermarkPositionEnum,
	OptionPatternEnum,
	AspectRatioEnum,
} from "@/interfaces/options.ts";
export const useOptionBasicStore = defineStore(
	"optionBasic",
	() => {
		const _data = ref<OptionBasicValues>({
			[OptionBasicEnum.PATTERN]: OptionPatternEnum.OUT, // 模式
			[OptionBasicEnum.MAIN_IMG_SIZE]: 0.90, // 主图尺寸
			[OptionBasicEnum.TEXT_BG_COLOR]: "#ffffff", // 文字背景
			[OptionBasicEnum.TEXT_BG_COLOR_USED]: false, // 文字背景是否启用
			[OptionBasicEnum.WATERMARK]: null, //   水印
			[OptionBasicEnum.WATERMARK_POSITION]: WatermarkPositionEnum.BOTTOM, // 水印位置
			[OptionBasicEnum.WATERMARK_USED]: false, // 水印是否启用
			[OptionBasicEnum.ROUNDED_SIZE]: 0.50, // 圆角
			[OptionBasicEnum.SHADOW_SIZE]: 0.05, // 阴影大小
			[OptionBasicEnum.BG_COLOR]: "#ffffff", // 背景颜色纯色
			[OptionBasicEnum.BG_COLOR_USED]: false, // 背景颜色是否启用
			[OptionBasicEnum.BG_BLUR]: 100, // 背景模糊
			[OptionBasicEnum.ASPECT_RATIO]: AspectRatioEnum.ASPECT_4_3, // 长宽比
			[OptionBasicEnum.ASPECT_RATIO_USED]: false, // 长宽比是否启用
			[OptionBasicEnum.OUTPUT_QUALITY]: 100, // 输出质量
		});

		// 设置
		const set = <K extends keyof OptionBasicValues>(
			key: K,
			value: OptionBasicValues[K]
		) => {
			_data.value[key] = value;
		};

		// 获取
		const get = <K extends keyof OptionBasicValues>(
			key: K
		): OptionBasicValues[K] => {
			return _data.value[key];
		};

		// 获取整体配置
		const getValue = () => {
			return {
				..._data.value,
			};
		};

		return {
			_data,
			set,
			get,
			getValue,
		};
	},
	{
		persist: {
			key: "optionBasic",
			storage: window?.localStorage,
		},
	}
);
