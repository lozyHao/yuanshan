/**
 * 通用配置
 */
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import {
	OptionTextTemplateValues,
	TextTemplatePositionEnum,
	ResultMessage
} from '@renderer/interfaces/options'
import { defTextTemps } from '@renderer/default/default-options'
import { getUUID } from '@renderer/utils/uuid'

interface addParamsValues {
	position: TextTemplatePositionEnum
	key: string
}

export const useOptionTextStore = defineStore(
	'optionText',
	() => {
		const _data = ref<OptionTextTemplateValues[]>([...defTextTemps])

		// 添加
		const add = (option: OptionTextTemplateValues): { status: boolean; msg: string } => {
			if (_data.value.length >= 12) {
				return { status: false, msg: '最多添加 10 项' }
			}
			option.key = getUUID()
			_data.value.push(option)
			return { status: true, msg: '添加成功' }
		}

		// 获取
		const get = (key: string): OptionTextTemplateValues | null => {
			return _data.value.find((item: OptionTextTemplateValues) => item.key === key) || null
		}

		// 移动，修改position，并移动到最开始
		const changePosition = async (params: addParamsValues): Promise<ResultMessage> => {
			const { position, key } = params
			return await new Promise((resolve) => {
				const len = checkMax(position)
				if (len >= 2) {
					resolve({
						status: 0,
						msg: '最多添加两个'
					})
					return
				}
				const item = _data.value.find((i: OptionTextTemplateValues) => i.key === key)
				if (item) {
					item.position = position
					resolve({
						status: 1,
						msg: '添加成功'
					})
				}
			})
		}

		// 交换顺序
		const changeOrder = (
			item: OptionTextTemplateValues,
			position: TextTemplatePositionEnum,
			status: number = 1 // -1:前移 1:后移
		) => {
			const othersList = _data.value.filter((i: OptionTextTemplateValues) => i.key !== item.key)
			const currentPList = _data.value.filter(
				(i: OptionTextTemplateValues) => i.position === position
			)
			const currentPIndex = currentPList.findIndex(
				(i: OptionTextTemplateValues) => i.key === item.key
			)

			if (status === -1 && currentPIndex > 0) {
				// 前移
				const nextIndex = othersList.findIndex(
					(i: OptionTextTemplateValues) => i.key === currentPList[currentPIndex - 1].key
				)
				if (nextIndex !== -1) {
					othersList.splice(nextIndex, 0, item)
					_data.value = othersList
				}
			} else if (status === 1 && currentPIndex < currentPList.length - 1) {
				// 后移
				const nextIndex = othersList.findIndex(
					(i: OptionTextTemplateValues) => i.key === currentPList[currentPIndex + 1].key
				)
				if (nextIndex !== -1) {
					if (nextIndex === othersList.length - 1) {
						othersList.push(item)
					} else {
						othersList.splice(nextIndex + 1, 0, item)
					}
					_data.value = othersList
				}
			}
		}

		// 校验是否达到最大、已存在
		const checkMax = (position: TextTemplatePositionEnum): number => {
			const data = _data.value.filter(
				(item: OptionTextTemplateValues) => item.position === position
			)
			return data.length
		}

		// 移除某一项
		const remove = (key: string) => {
			const item = _data.value.find((item: OptionTextTemplateValues) => item.key === key)
			if (item) {
				item.position = TextTemplatePositionEnum.NO
			}
		}

		// 编辑
		const edit = (option: OptionTextTemplateValues) => {
			const item = _data.value.find((item: OptionTextTemplateValues) => item.key === option.key)
			if (item) {
				Object.assign(item, option)
			}
		}

		// 删除
		const del = (key: string) => {
			_data.value = _data.value.filter((item: OptionTextTemplateValues) => item.key !== key)
		}

		// 整体导入文字模板（含中线位置）
		const setAll = (
			templates: OptionTextTemplateValues[],
			positions?: {
				header?: [number, number, number]
				middle?: [number, number, number]
				footer?: [number, number, number]
			}
		) => {
			if (Array.isArray(templates)) {
				_data.value = [...templates]
			}
			if (positions) {
				if (positions.header) textPositionsHeader.value = positions.header
				if (positions.middle) textPositionsMiddle.value = positions.middle
				if (positions.footer) textPositionsFooter.value = positions.footer
			}
		}

		// 恢复默认
		const reset = () => {
			_data.value = [...defTextTemps]
		}


		// 文字模板的内容中线位置
		const textPositionsHeader = ref<[number, number, number]>([0.3, 0.5, 0.7])
		const textPositionsMiddle = ref<[number, number, number]>([0.3, 0.5, 0.7])
		const textPositionsFooter = ref<[number, number, number]>([0.3, 0.5, 0.7])

		const setTextPosition = (position: TextTemplatePositionEnum, value: [number, number, number]) => {
			if (position === TextTemplatePositionEnum.HEADER) {
				textPositionsHeader.value = value

				console.log(position, textPositionsHeader.value)
			} else if (position === TextTemplatePositionEnum.MIDDLE) {
				textPositionsMiddle.value = value

				console.log(position, textPositionsMiddle.value)
			} else if (position === TextTemplatePositionEnum.FOOTER) {
				textPositionsFooter.value = value

				console.log(position, textPositionsFooter.value)
			}
		}

		const getTextPosition = (position: TextTemplatePositionEnum): [number, number, number] => {
			console.log(position)
			if (position === TextTemplatePositionEnum.HEADER) {
				return textPositionsHeader.value
			} else if (position === TextTemplatePositionEnum.MIDDLE) {
				return textPositionsMiddle.value
			} else if (position === TextTemplatePositionEnum.FOOTER) {
				return textPositionsFooter.value
			}
			return [0.3, 0.5, 0.7]
		}

		const resetTextPosition = () => {
			textPositionsHeader.value = [0.3, 0.5, 0.7]
			textPositionsMiddle.value = [0.3, 0.5, 0.7]
			textPositionsFooter.value = [0.3, 0.5, 0.7]
		}

		return {
			_data,
			get,
			add,
			changePosition,
			changeOrder,
			remove,
			edit,
			del,
			setAll,
			reset,
			textPositionsHeader,
			textPositionsMiddle,
			textPositionsFooter,
			setTextPosition,
			getTextPosition,
			resetTextPosition
		}
	},
	{
		persist: {
			key: 'optionText',
			storage: window?.localStorage
		}
	}
)

// 支持 HMR：修改本 store 文件后热更新会替换实例，避免出现旧实例方法缺失
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useOptionTextStore, import.meta.hot))
}
