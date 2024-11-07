<script setup lang="ts">
import { computed } from "vue";
import { useOptionBasicStore } from "@/store/optionBasic";
import { OptionBasicEnum, } from "@/interfaces/options";

import { modalOptions, watermarkPositionOptions } from "@/default/default-options.ts";

import UploadFile from "@/components/UploadFile.vue";

const store = useOptionBasicStore();

const formValue = computed(() => {
	return { ...store.getValue() };
});

const handleChange = async (key: OptionBasicEnum, value: string) => {
	if (key === OptionBasicEnum.WATERMARK) {
		// 图片，转换为blob存储
		store.set(key, value);
		return;
	}
	store.set(key, value);
};
</script>

<template>
	<div class="option-basic pb-10">
		<n-grid x-gap="12" y-gap="16" :cols="7">
			<n-gi :span="2" class="flex-end">模式</n-gi>
			<n-gi :span="5" class="flex-start">
				<n-space>
					<img class="w-20 cursor-pointer border-2 border-solid rounded-md hover:border-#2080f0" :class="[
						formValue.pattern === item.key
							? 'border-#2080f0'
							: 'border-color15',
					]" v-for="item in modalOptions" :key="item.key" :src="item.img" @click="handleChange('pattern', item.key)" />
				</n-space>
			</n-gi>
			<n-gi :span="2" class="flex-end">主图占比</n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider :step="0.02" :min="0.50" :max="1" v-model:value="formValue.mainImgSize"
					@update:value="handleChange('mainImgSize', $event)" />
				<span class="w-12 pl-2">{{ formValue.mainImgSize }}</span>
			</n-gi>
			<n-gi :span="7">
				<n-divider />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 文字背景 </n-gi>
			<n-gi :span="5" class="flex-start">
				<n-switch size="small" v-model:value="formValue.textBgColorUsed"
					@update:value="handleChange('textBgColorUsed', $event)" />
				<n-color-picker class="ml-2" :modes="['hex']" :show-alpha="false" :disabled="!formValue.textBgColorUsed"
					v-model:value="formValue.textBgColor" @update:value="handleChange('textBgColor', $event)" />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 水印 </n-gi>
			<n-gi :span="5" class="flex-between">
				<n-switch size="small" v-model:value="formValue.watermarkUsed"
					@update:value="handleChange('watermarkUsed', $event)" />
				<n-image v-if="formValue.watermarkUsed" class="ml-2 flex-1 h-10 w-full" object-fit="contain"
					:src="formValue.watermark"></n-image>
				<upload-file v-if="formValue.watermarkUsed" :iconSize="'small'"
					@on-change="handleChange('watermark', $event)"></upload-file>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 水印位置 </n-gi>
			<n-gi :span="5">
				<n-select :options="watermarkPositionOptions" :disabled="!formValue.watermarkUsed"
					v-model:value="formValue.watermarkPosition"
					@update:value="handleChange('watermarkPosition', $event)" />
			</n-gi>
			<n-gi :span="7">
				<n-divider />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 圆角大小 </n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider :step="0.01" :min="0" :max="0.50" v-model:value="formValue.roundedSize"
					@update:value="handleChange('roundedSize', $event)" />
				<span class="w-12 pl-2">{{ formValue.roundedSize }}</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 阴影大小 </n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider :step="0.01" :min="0" :max="0.20" v-model:value="formValue.shadowSize"
					@update:value="handleChange('shadowSize', $event)" />
				<span class="w-12 pl-2">{{ formValue.shadowSize }}</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 纯色背景 </n-gi>
			<n-gi :span="5" class="flex-center">
				<n-switch size="small" v-model:value="formValue.bgColorUsed"
					@update:value="handleChange('bgColorUsed', $event)" />
				<n-color-picker class="ml-2" :modes="['hex']" :show-alpha="false" :disabled="!formValue.bgColorUsed"
					v-model:value="formValue.bgColor" @update:value="handleChange('bgColor', $event)" />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 背景模糊 </n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider :step="10" :min="0" :max="600" v-model:value="formValue.bgBlur"
					@update:value="handleChange('bgBlur', $event)" />
				<span class="w-12 pl-2">{{ formValue.bgBlur }}</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 固定宽高比 </n-gi>
			<n-gi :span="5" class="flex-center">
				<n-switch size="small" v-model:value="formValue.aspectRatioUsed"
					@update:value="handleChange('aspectRatioUsed', $event)" />
				<n-select class="ml-2" :options="[]" :disabled="!formValue.aspectRatioUsed"
					v-model:value="formValue.aspectRatio" @update:value="handleChange('aspectRatio', $event)" />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 输出质量 </n-gi>
			<n-gi :span="5">
				<n-slider :step="2" :min="50" :max="100" v-model:value="formValue.outputQuality"
					@update:value="handleChange('outputQuality', $event)" />
			</n-gi>
		</n-grid>
	</div>
</template>
