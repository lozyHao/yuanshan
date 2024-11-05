/**
 * 通用配置
 */
import { defineStore } from "pinia";
import { reactive } from "vue";
import {
	OptionDefaultValues,
	OptionDefaultEnum
} from "@/interfaces/options.ts";
import { defaultOptions } from '@/default/default-options.ts'

export const useOptionDefaultStore = defineStore(
	"optionDefault",
	() => {
		const _data = reactive<OptionDefaultValues>({
			[OptionDefaultEnum.OUTPUT_PATH]: defaultOptions.defaultDir, // 输出目录
			[OptionDefaultEnum.FONT]: defaultOptions.fontFamily, // 字体
			[OptionDefaultEnum.SIZE]: defaultOptions.fontSize, // 字号
			[OptionDefaultEnum.ITALIC]: defaultOptions.fontItalic, // 斜体
			[OptionDefaultEnum.BOLD]: defaultOptions.fontBold, // 粗体
			[OptionDefaultEnum.COLOR]: defaultOptions.fontColor, // 颜色
		});

		// 设置
		const set = <K extends keyof OptionDefaultValues>(
			key: K,
			value: OptionDefaultValues[K]
		) => {
			_data[key] = value;
		};

		// 获取
		const get = <K extends keyof OptionDefaultValues>(
			key: K
		): OptionDefaultValues[K] => {
			return _data[key];
		};

		// 获取整体配置
		const getValue = () => {
			return {
				..._data,
			};
		};

		// 添加
		return {
			_data,
			set,
			get,
			getValue,
		};
	},
	{
		persist: {
			key: "optionDefault",
			storage: window?.localStorage,
		},
	}
);
