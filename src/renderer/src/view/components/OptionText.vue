<script setup lang="ts">
import {
	EditSettings24Regular,
	Add24Filled,
	SubtractCircle24Regular,
	CaretUp12Filled,
	CaretDown12Filled,
	ArrowMinimizeVertical24Regular
} from '@vicons/fluent'

import PopTextTemplateEdit from '@renderer/components/PopTextTemplateEdit.vue'

import { computed, ref } from 'vue'
import { useOptionTextStore } from '@renderer/store/optionText'
import { OptionTextTemplateValues, TextTemplatePositionEnum } from '@renderer/interfaces/options'
import { useMessage } from 'naive-ui'

const store = useOptionTextStore()

const allList = computed(() => store._data)
const headerList = computed(() =>
	store._data.filter(
		(item: OptionTextTemplateValues) => item.position === TextTemplatePositionEnum.HEADER
	)
)
const middleList = computed(() =>
	store._data.filter(
		(item: OptionTextTemplateValues) => item.position === TextTemplatePositionEnum.MIDDLE
	)
)
const footerList = computed(() =>
	store._data.filter(
		(item: OptionTextTemplateValues) => item.position === TextTemplatePositionEnum.FOOTER
	)
)

const message = useMessage()

// 编辑/添加
const textTemplateEditPopShow = ref(false)
const currentItem = ref<OptionTextTemplateValues | null>(null)
const onClickEdit = (item: OptionTextTemplateValues | null) => {
	currentItem.value = item
	textTemplateEditPopShow.value = true
}

const onSubmit = (template: OptionTextTemplateValues | null) => {
	if (!template) return
	if (template.key) {
		// 修改
		store.edit(template)
		message.success('修改成功')
	} else {
		// 添加
		const { status, msg } = store.add(template)
		if (!status) {
			message.error(msg)
			return
		}
		message.success('添加成功')
	}
}

const onDelete = (key: string) => {
	store.del(key)
	message.success('删除成功')
}

/** 移动操作 */
// 添加到某位置
const onMove = async (item: OptionTextTemplateValues, position: TextTemplatePositionEnum) => {
	const result = await store.changePosition({
		position,
		key: item.key as string
	})
	if (result.status === 1) {
		message.success(result.msg)
		return
	}
	message.error(result.msg)
}
// 从某个位置移除
const onRemove = async (item: OptionTextTemplateValues) => {
	store.remove(item.key as string)
}
// 交换位置顺序，修改order
const onChangeOrder = async (
	item: OptionTextTemplateValues,
	p: TextTemplatePositionEnum,
	status: number = 1
) => {
	store.changeOrder(item, p, status)
}


// 文字模版，内容的位置详情
const textPositionsHeader = computed<[number, number, number]>(() => store.textPositionsHeader || [0.3, 0.5, 0.7])
const textPositionsMiddle = computed<[number, number, number]>(() => store.textPositionsMiddle || [0.3, 0.5, 0.7])
const textPositionsFooter = computed<[number, number, number]>(() => store.textPositionsFooter || [0.3, 0.5, 0.7])

const onChangeTextPosition = (position: TextTemplatePositionEnum, value: number, index: number) => {
	let arr: [number, number, number] = [0.3, 0.5, 0.7]
	if (position === TextTemplatePositionEnum.HEADER) {
		arr = [...textPositionsHeader.value]
	} else if (position === TextTemplatePositionEnum.MIDDLE) {
		arr = [...textPositionsMiddle.value]
	} else if (position === TextTemplatePositionEnum.FOOTER) {
		arr = [...textPositionsFooter.value]
	}
	arr[index] = value

	store.setTextPosition(position, arr)
}
</script>
<template>
	<div class="option-text pl-3 pb-10">
		<n-grid x-gap="12" y-gap="8" :cols="1">
			<n-gi class="color9 text-base font-bold mb-2">
				<span>配置详情</span>
			</n-gi>

			<n-gi class="mb-2">
				<div class="flex items-center">
					<span class="pr-4">头部</span>
					<n-popover trigger="hover" placement="right">
						<template #trigger>
							<n-button strong secondary type="info" size="tiny">
								<template #icon>
									<n-icon :size="16" :component="ArrowMinimizeVertical24Regular" />
								</template>
							</n-button>
						</template>
						<div class="w-70 p-2">
							<n-grid x-gap="0" y-gap="6" :cols="5">
								<n-gi :span="5" class="flex-center">
									<span>内容对齐线配置(由下而上)</span>
								</n-gi>
								<n-gi :span="1">
									<span class="pr-2">二级</span>
								</n-gi>
								<n-gi class="flex" :span="1" :offset="2">
									<n-slider v-model:value="textPositionsHeader[2]"
										@update:value="onChangeTextPosition(TextTemplatePositionEnum.HEADER, $event, 2)"
										:step="0.05" :min="0.5" :max="1"></n-slider>
								</n-gi>
								<n-gi :span="1" class="flex-end">
									<span>{{ textPositionsHeader[2] }}</span>
								</n-gi>
								<n-gi :span="1">
									<span class="pr-2">中级</span>
								</n-gi>
								<n-gi class="flex" :span="3">
									<n-slider v-model:value="textPositionsHeader[1]"
										@update:value="onChangeTextPosition(TextTemplatePositionEnum.HEADER, $event, 1)"
										:step="0.05" :min="0" :max="1"></n-slider>
								</n-gi>
								<n-gi :span="1" class="flex-end">
									<span>{{ textPositionsHeader[1] }}</span>
								</n-gi>
								<n-gi :span="1">
									<span class="pr-2">一级</span>
								</n-gi>
								<n-gi class="flex-center" :span="1">
									<n-slider v-model:value="textPositionsHeader[0]"
										@update:value="onChangeTextPosition(TextTemplatePositionEnum.HEADER, $event, 0)"
										:step="0.05" :min="0" :max="0.5"></n-slider>
								</n-gi>
								<n-gi class="flex-end" :span="3">
									<span>{{ textPositionsHeader[0] }}</span>
								</n-gi>
							</n-grid>
						</div>
					</n-popover>
					<span class="color12 pl-2 text-xs">文本中线({{ textPositionsHeader }})</span>
				</div>
				<div v-show="headerList.length === 0" class="flex-center color9">无配置项</div>
				<div v-for="(item, index) in headerList" :key="item.key as string"
					class="flex-end bg-color15 rounded-lg p-1 my-2">
					<div class="px-2 flex-1">{{ item.name }}</div>
					<n-space size="small">
						<!-- 上移 -->
						<n-button strong secondary circle size="tiny" v-if="index > 0 && headerList.length > 1"
							@click="onChangeOrder(item, TextTemplatePositionEnum.HEADER, -1)">
							<template #icon>
								<n-icon :size="16" :component="CaretUp12Filled" />
							</template>
						</n-button>
						<!-- 下移 -->
						<n-button strong secondary circle size="tiny" v-if="index < headerList.length - 1"
							@click="onChangeOrder(item, TextTemplatePositionEnum.HEADER, 1)">
							<template #icon>
								<n-icon :size="16" :component="CaretDown12Filled" />
							</template>
						</n-button>
						<n-popover trigger="hover">
							<template #trigger>
								<n-button strong secondary circle type="warning" size="tiny">
									<template #icon>
										<n-icon :size="16" :component="SubtractCircle24Regular" />
									</template>
								</n-button>
							</template>
							<n-space size="small">
								<span>确定移除吗？ </span>
								<n-button type="warning" strong secondary size="tiny" @click="onRemove(item)">
									移除
								</n-button>
							</n-space>
						</n-popover>
					</n-space>
				</div>
			</n-gi>
			<n-gi class="mb-2">
				<div class="flex items-center">
					<span class="pr-4">中间</span>
					<n-popover trigger="hover" placement="right">
						<template #trigger>
							<n-button strong secondary type="info" size="tiny">
								<template #icon>
									<n-icon :size="16" :component="ArrowMinimizeVertical24Regular" />
								</template>
							</n-button>
						</template>
						<div class="w-70 p-2">
							<n-grid x-gap="0" y-gap="6" :cols="5">
								<n-gi :span="5" class="flex-center">
									<span>内容对齐线配置(由下而上)</span>
								</n-gi>
								<n-gi :span="1">
									<span class="pr-2">二级</span>
								</n-gi>
								<n-gi class="flex" :span="1" :offset="2">
									<n-slider v-model:value="textPositionsMiddle[2]"
										@update:value="onChangeTextPosition(TextTemplatePositionEnum.MIDDLE, $event, 2)"
										:step="0.05" :min="0.5" :max="1"></n-slider>
								</n-gi>
								<n-gi :span="1" class="flex-end">
									<span>{{ textPositionsMiddle[2] }}</span>
								</n-gi>
								<n-gi :span="1">
									<span class="pr-2">中级</span>
								</n-gi>
								<n-gi class="flex" :span="3">
									<n-slider v-model:value="textPositionsMiddle[1]"
										@update:value="onChangeTextPosition(TextTemplatePositionEnum.MIDDLE, $event, 1)"
										:step="0.05" :min="0" :max="1"></n-slider>
								</n-gi>
								<n-gi :span="1" class="flex-end">
									<span>{{ textPositionsMiddle[1] }}</span>
								</n-gi>
								<n-gi :span="1">
									<span class="pr-2">一级</span>
								</n-gi>
								<n-gi class="flex-center" :span="1">
									<n-slider v-model:value="textPositionsMiddle[0]"
										@update:value="onChangeTextPosition(TextTemplatePositionEnum.MIDDLE, $event, 0)"
										:step="0.05" :min="0" :max="0.5"></n-slider>
								</n-gi>
								<n-gi class="flex-end" :span="3">
									<span>{{ textPositionsMiddle[0] }}</span>
								</n-gi>
							</n-grid>
						</div>
					</n-popover>
					<span class="color12 pl-2 text-xs">文本中线({{ textPositionsMiddle }})</span>
				</div>
				<div v-show="middleList.length === 0" class="flex-center color9">无配置项</div>
				<div v-for="(item, index) in middleList" :key="item.key as string"
					class="flex-end bg-color15 rounded-lg p-1 my-2">
					<div class="px-2 flex-1">{{ item.name }}</div>
					<n-space size="small">
						<!-- 上移 -->
						<n-button strong secondary circle size="tiny" v-if="index > 0 && middleList.length > 1"
							@click="onChangeOrder(item, TextTemplatePositionEnum.MIDDLE, -1)">
							<template #icon>
								<n-icon :size="16" :component="CaretUp12Filled" />
							</template>
						</n-button>
						<!-- 下移 -->
						<n-button strong secondary circle size="tiny" v-if="index < middleList.length - 1"
							@click="onChangeOrder(item, TextTemplatePositionEnum.MIDDLE, 1)">
							<template #icon>
								<n-icon :size="16" :component="CaretDown12Filled" />
							</template>
						</n-button>
						<n-popover trigger="hover">
							<template #trigger>
								<n-button strong secondary circle type="warning" size="tiny">
									<template #icon>
										<n-icon :size="16" :component="SubtractCircle24Regular" />
									</template>
								</n-button>
							</template>
							<n-space size="small">
								<span>确定移除吗？ </span>
								<n-button type="warning" strong secondary size="tiny" @click="onRemove(item)">
									移除
								</n-button>
							</n-space>
						</n-popover>
					</n-space>
				</div>
			</n-gi>
			<n-gi class="mb-2">
				<div class="flex items-center">
					<span class="pr-4">尾部</span>
					<n-popover trigger="hover" placement="right">
						<template #trigger>
							<n-button strong secondary type="info" size="tiny">
								<template #icon>
									<n-icon :size="16" :component="ArrowMinimizeVertical24Regular" />
								</template>
							</n-button>
						</template>
						<div class="w-70 p-2">
							<n-grid x-gap="0" y-gap="6" :cols="5">
								<n-gi :span="5" class="flex-center">
									<span>内容对齐线配置(由下而上)</span>
								</n-gi>
								<n-gi :span="1">
									<span class="pr-2">二级</span>
								</n-gi>
								<n-gi class="flex" :span="1" :offset="2">
									<n-slider v-model:value="textPositionsFooter[2]"
										@update:value="onChangeTextPosition(TextTemplatePositionEnum.FOOTER, $event, 2)"
										:step="0.05" :min="0.5" :max="1"></n-slider>
								</n-gi>
								<n-gi :span="1" class="flex-end">
									<span>{{ textPositionsFooter[2] }}</span>
								</n-gi>
								<n-gi :span="1">
									<span class="pr-2">中级</span>
								</n-gi>
								<n-gi class="flex" :span="3">
									<n-slider v-model:value="textPositionsFooter[1]"
										@update:value="onChangeTextPosition(TextTemplatePositionEnum.FOOTER, $event, 1)"
										:step="0.05" :min="0" :max="1"></n-slider>
								</n-gi>
								<n-gi :span="1" class="flex-end">
									<span>{{ textPositionsFooter[1] }}</span>
								</n-gi>
								<n-gi :span="1">
									<span class="pr-2">一级</span>
								</n-gi>
								<n-gi class="flex-center" :span="1">
									<n-slider v-model:value="textPositionsFooter[0]"
										@update:value="onChangeTextPosition(TextTemplatePositionEnum.FOOTER, $event, 0)"
										:step="0.05" :min="0" :max="0.5"></n-slider>
								</n-gi>
								<n-gi class="flex-end" :span="3">
									<span>{{ textPositionsFooter[0] }}</span>
								</n-gi>
							</n-grid>
						</div>
					</n-popover>
					<span class="color12 pl-2 text-xs">文本中线({{ textPositionsFooter }})</span>
				</div>
				<div v-show="footerList.length === 0" class="flex-center color9">无配置项</div>
				<div v-for="(item, index) in footerList" :key="item.key as string"
					class="flex-end bg-color15 rounded-lg p-1 my-2">
					<div class="px-2 flex-1">{{ item.name }}</div>
					<n-space size="small">
						<!-- 上移 -->
						<n-button strong secondary circle size="tiny" v-if="index > 0 && footerList.length > 1"
							@click="onChangeOrder(item, TextTemplatePositionEnum.FOOTER, -1)">
							<template #icon>
								<n-icon :size="16" :component="CaretUp12Filled" />
							</template>
						</n-button>
						<!-- 下移 -->
						<n-button strong secondary circle size="tiny" v-if="index < footerList.length - 1"
							@click="onChangeOrder(item, TextTemplatePositionEnum.FOOTER, 1)">
							<template #icon>
								<n-icon :size="16" :component="CaretDown12Filled" />
							</template>
						</n-button>
						<n-popover trigger="hover">
							<template #trigger>
								<n-button strong secondary circle type="warning" size="tiny">
									<template #icon>
										<n-icon :size="16" :component="SubtractCircle24Regular" />
									</template>
								</n-button>
							</template>
							<n-space size="small">
								<span>确定移除吗？ </span>
								<n-button type="warning" strong secondary size="tiny" @click="onRemove(item)">
									移除
								</n-button>
							</n-space>
						</n-popover>
					</n-space>
				</div>
			</n-gi>
			<n-gi class="mt-3">
				<n-divider />
			</n-gi>
			<n-gi class="color9 flex-between text-base font-bold mb-2">
				<span>模板列表</span>
				<n-popover trigger="hover">
					<template #trigger>
						<n-button strong secondary circle type="info" size="small" @click="onClickEdit(null)">
							<template #icon>
								<n-icon :component="Add24Filled" />
							</template>
						</n-button>
					</template>
					添加模板
				</n-popover>
			</n-gi>
			<n-gi class="flex-between bg-color15 rounded-lg p-1" v-for="item in allList" :key="item.key">
				<div class="px-2 flex-1">{{ item.name }}</div>
				<n-space size="small">
					<n-button strong secondary circle type="info" size="tiny" @click="onClickEdit(item)">
						<template #icon>
							<n-icon :component="EditSettings24Regular" />
						</template>
					</n-button>
					<n-popover trigger="hover">
						<template #trigger>
							<n-button strong secondary circle type="info" size="tiny">
								<template #icon>
									<n-icon :component="Add24Filled" />
								</template>
							</n-button>
						</template>
						<n-space size="small">
							<span>添加到 </span>
							<n-button type="success" strong secondary size="tiny"
								@click="onMove(item, TextTemplatePositionEnum.HEADER)">
								头部
							</n-button>
							<n-button type="info" strong secondary size="tiny"
								@click="onMove(item, TextTemplatePositionEnum.MIDDLE)">
								中间
							</n-button>
							<n-button type="warning" strong secondary size="tiny"
								@click="onMove(item, TextTemplatePositionEnum.FOOTER)">
								尾部
							</n-button>
						</n-space>
					</n-popover>
				</n-space>
			</n-gi>
		</n-grid>
	</div>
	<pop-text-template-edit v-model:show="textTemplateEditPopShow" :pre="currentItem" @on-submit="onSubmit"
		@on-delete="onDelete"></pop-text-template-edit>
</template>
