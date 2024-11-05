/**
 * 通用配置
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import { OptionLensValues, OptionLensEnum } from "@/interfaces/options.ts";
import { exifFields } from "@/default/default-options.ts";
import { getUUID } from "@/utils/uuid";

export const useOptionLensStore = defineStore(
	"optionLens",
	() => {
		const _data = ref<OptionLensValues[]>([...exifFields]);

		// 添加
		const add = (option: OptionLensValues) => {
			option.key = getUUID();
			option.description = `{${option.key}}`;
			_data.value.push(option);
		};

		// 获取
		const get = (key: string): OptionLensValues => {
			return _data.value.find(
				(item: OptionLensValues) => item[OptionLensEnum.KEY] === key
			) as OptionLensValues;
		};

		// 编辑
		const edit = (option: OptionLensValues) => {
			const item = _data.value.find(
				(item: OptionLensValues) =>
					item[OptionLensEnum.KEY] === option[OptionLensEnum.KEY]
			);
			if (item) {
				Object.assign(item, option);
			}
		};

		// 删除
		const del = (key: string) => {
			_data.value = _data.value.filter(
				(item: OptionLensValues) => item[OptionLensEnum.KEY] !== key
			);
		};

		// 获取所有
		const getValue = () => {
			return [..._data.value];
		};

		return {
			_data,
			get,
			add,
			edit,
			del,
			getValue,
		};
	},
	{
		persist: {
			key: "optionLens",
			storage: window?.localStorage,
		},
	}
);
