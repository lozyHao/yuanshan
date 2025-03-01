<script setup lang="ts">
import ImageData from '@renderer/hooks/imageData';
import { IconSize, OptionBasicEnum, OptionBasicValues } from '@renderer/interfaces/options';

import { computed } from 'vue';
import { useFileStore } from '@renderer/store/file';
import { useOptionBasicStore } from '@renderer/store/optionBasic';
import { useOptionLensStore } from '@renderer/store/optionLens';
import { useOptionTextStore } from '@renderer/store/optionText';

import { TextTemplatePositionEnum } from "@renderer/interfaces/options"

import UploadFile from '@renderer/components/UploadFile.vue'
import OpenDir from '@renderer/components/openDir.vue'
import { outputFormatOptions } from '@renderer/default/default-options';

const outputStatus = {
	no: '等待中',
	loading: '处理中',
	save: '文件存储中',
	success: '成功',
	fail: '失败'
}

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['update:show'])

const show = computed(() => props.show)
const tagType = (status: string) => {
	if (status === 'no') return 'default'
	if (status === 'loading' || status === 'save') return 'info'
	if (status === 'success') return 'success'
	if (status === 'fail') return 'error'
	return 'default'
}

const store = useFileStore();
// 获取参数 stroe
const basicStore = useOptionBasicStore();
const textStore = useOptionTextStore();
const lensStore = useOptionLensStore();


const fileList = computed<ImageData[]>(() => store._imageData);
const outputLoading = computed(() => store._outputLoading);


// 文本的位置中心配置项
const headerTextPosition = computed<[number, number, number]>(() => {
	return textStore.getTextPosition(TextTemplatePositionEnum.HEADER)
})
const middleTextPosition = computed<[number, number, number]>(() => {
	return textStore.getTextPosition(TextTemplatePositionEnum.MIDDLE)
})
const footerTextPosition = computed<[number, number, number]>(() => {
	return textStore.getTextPosition(TextTemplatePositionEnum.FOOTER)
})

// 开始输出
const onOutput = () => {
	store.restoreDefault()
	store.startOutput({
		basic: basicStore._data,
		text: textStore._data,
		lens: lensStore._data,
		textPosition: { headerTextPosition: headerTextPosition.value, middleTextPosition: middleTextPosition.value, footerTextPosition: footerTextPosition.value }
	});
};

const onClose = () => {
	emits('update:show', false)
}

// 结束：输出结束并且关闭弹窗后，让文件列表状态恢复默认
const onEnd = () => {
	store.restoreDefault()
}


// 基础配置设置
const formValue = computed<OptionBasicValues>(() => {
	return { ...basicStore.getValue() }
})
const handleChange = async (key: OptionBasicEnum, value: string) => {
	basicStore.set(key, value)
}
</script>

<template>
	<n-modal v-model:show="show" title="处理输出" preset="card" size="huge" :mask-closable="false"
		:style="{ width: '720px' }" @update:show="onClose" @after-leave="onEnd">
		<!-- 输出目录配置 和 输出质量配置 -->
		<n-grid class="bg-color16 mb-2 p-2 rounded-xl" x-gap="10" y-gap="16" :cols="10">
			<n-gi :span="1" class="flex-end">输出目录</n-gi>
			<n-gi :span="8">
				<n-ellipsis>
					<span class="text-xs">{{ formValue.outputPath }}</span>
				</n-ellipsis>
			</n-gi>
			<n-gi :span="1" class="flex-end">
				<n-space>
					<open-dir :icon-size="IconSize.Mini" :dir="formValue.outputPath" :disabled="outputLoading">
					</open-dir>
					<upload-file :icon-size="IconSize.Mini" :file-type="'directory'" :disabled="outputLoading"
						@on-change="handleChange(OptionBasicEnum.OUTPUT_PATH, $event)">
					</upload-file>
				</n-space>
			</n-gi>
			<n-gi :span="1" class="flex-end"> 输出质量 </n-gi>
			<n-gi :span="4" class="flex-start">
				<n-slider v-model:value="formValue.outputQuality" :step="2" :min="10" :max="100"
					:disabled="outputLoading" @update:value="handleChange(OptionBasicEnum.OUTPUT_QUALITY, $event)" />
			</n-gi>
			<n-gi :span="1" class="flex-end"> 输出格式 </n-gi>
			<n-gi :span="4" class="flex-start">
				<n-select v-model:value="formValue.outputFormat" :options="outputFormatOptions"
					:disabled="outputLoading" @update:value="handleChange(OptionBasicEnum.OUTPUT_FORMAT, $event)" />
			</n-gi>
		</n-grid>
		<!-- 文件列表展示 -->
		<div
			class="default-layout h-80 w-full mb-4 p-2 overflow-y-auto border-color16 border-1 border-solid rounded-xl">
			<div class="bg-color13 flex-between px-2 py-1 rounded-lg mb-1 overflow-hidden"
				v-for="(item, index) in fileList" :key="item.key">
				<div class="color9 pr-2 flex-center font-bold text-xl border-color15 border-r-1 border-r-solid">{{ index
					+ 1
				}}</div>
				<div class="flex-1 pl-3">
					<div class="font-bold">{{ item.filename }}</div>
					<n-progress class="mt-1" style="width: calc(100% - 48px);" type="line"
						:percentage="item.outputPercent" />
				</div>
				<n-tag class="ml-4" size="small" :bordered="false" :type="tagType(item.outputStatus)">{{
					outputStatus[item.outputStatus]
				}}</n-tag>
			</div>
		</div>

		<div class="flex-end">
			<n-button type="info" @click="onOutput" :disabled="outputLoading">开始输出</n-button>
		</div>
	</n-modal>

</template>