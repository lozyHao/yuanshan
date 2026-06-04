import { useOptionBasicStore } from '@renderer/store/optionBasic'
import { useOptionTextStore } from '@renderer/store/optionText'
import { useOptionLensStore } from '@renderer/store/optionLens'
import {
	buildConfig,
	downloadConfig,
	parseConfigFile,
	YuanshanConfig
} from '@renderer/utils/configIO'

/**
 * 配置导入/导出/应用的统一入口。
 * 导出、文件导入、以及预设模板的应用都走同一套逻辑，避免分散维护。
 * 注意：需在组件 setup 内调用（依赖 Pinia 已激活）。
 */
export function useConfigIO() {
	const basicStore = useOptionBasicStore()
	const textStore = useOptionTextStore()
	const lensStore = useOptionLensStore()

	// 汇总当前配置（基础 + 文字模板含中线位置 + 相机参数）
	const collectConfig = (): YuanshanConfig => {
		return buildConfig({
			basic: basicStore.getValue(),
			text: {
				templates: [...textStore._data],
				textPositions: {
					header: [...textStore.textPositionsHeader] as [number, number, number],
					middle: [...textStore.textPositionsMiddle] as [number, number, number],
					footer: [...textStore.textPositionsFooter] as [number, number, number]
				}
			},
			lens: lensStore.getValue()
		})
	}

	// 导出为 JSON 文件
	const exportConfig = () => {
		downloadConfig(collectConfig())
	}

	// 应用一份配置数据（深拷贝，避免预设/导入源对象被后续编辑污染）
	const applyConfigData = (data: YuanshanConfig['data']) => {
		const cloned = structuredClone(data)
		if (cloned.basic) basicStore.setAll(cloned.basic)
		if (cloned.text?.templates) textStore.setAll(cloned.text.templates, cloned.text.textPositions)
		if (cloned.lens) lensStore.setAll(cloned.lens)
	}

	// 从文件导入并应用
	const importConfigFile = async (file: File) => {
		const config = await parseConfigFile(file)
		applyConfigData(config.data)
	}

	return { collectConfig, exportConfig, applyConfigData, importConfigFile }
}
