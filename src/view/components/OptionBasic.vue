<script setup lang="ts">
import { computed } from "vue";
import { useOptionBasicStore } from "@/store/optionBasic";
import { IconSize, OptionBasicEnum, OptionBasicValues } from "@/interfaces/options";

import { modalOptions, watermarkPositionOptions } from "@/default/default-options.ts";

import UploadFile from "@/components/UploadFile.vue";
import OpenDir from "@/components/openDir.vue";
import cameraSelect from "@/components/CameraSelect.vue";

const store = useOptionBasicStore();

const formValue = computed<OptionBasicValues>(() => {
	return { ...store.getValue() };
});

const handleChange = async (key: OptionBasicEnum, value: string) => {
	store.set(key, value);
};
</script>

<template>
	<div class="option-basic pb-10">
		<n-grid x-gap="6" y-gap="16" :cols="7">
			<n-gi :span="2" class="flex-end">输出目录</n-gi>
			<n-gi :span="3">
				<n-ellipsis>
					<span class="text-xs">{{ formValue.outputPath }}</span>
				</n-ellipsis>
			</n-gi>
			<n-gi :span="2" class="flex-end">
				<n-space>
					<open-dir :iconSize="IconSize.Mini" :dir="formValue.outputPath">
					</open-dir>
					<upload-file :iconSize="IconSize.Mini" :file-type="'directory'"
						@on-change="handleChange(OptionBasicEnum.OUTPUT_PATH, $event)">
					</upload-file>
				</n-space>
			</n-gi>
			<n-gi :span="2" class="flex-end">模式</n-gi>
			<n-gi :span="5" class="flex-start">
				<n-space>
					<img class="w-20 cursor-pointer border-2 border-solid rounded-md hover:border-#2080f0" :class="[
						formValue.pattern === item.key
							? 'border-#2080f0'
							: 'border-color15',
					]" v-for="item in modalOptions" :key="item.key" :src="item.img"
						@click="handleChange(OptionBasicEnum.PATTERN, item.key)" />
				</n-space>
			</n-gi>
			<n-gi :span="2" class="flex-end">主图占比</n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider :step="1" :min="50" :max="100" v-model:value="formValue.mainImgSize"
					@update:value="handleChange(OptionBasicEnum.MAIN_IMG_SIZE, $event)" />
				<span class="w-12 pl-2">{{ formValue.mainImgSize }}</span>
			</n-gi>
			<n-gi :span="7">
				<n-divider />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 文字背景 </n-gi>
			<n-gi :span="5" class="flex-start">
				<n-switch size="small" v-model:value="formValue.textBgColorUsed"
					@update:value="handleChange(OptionBasicEnum.TEXT_BG_COLOR_USED, $event)" />
				<n-color-picker class="ml-2" :modes="['hex']" :show-alpha="false" :disabled="!formValue.textBgColorUsed"
					v-model:value="formValue.textBgColor"
					@update:value="handleChange(OptionBasicEnum.TEXT_BG_COLOR, $event)" />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 水印 </n-gi>
			<n-gi :span="1" class="flex-between">
				<n-switch size="small" v-model:value="formValue.watermarkUsed"
					@update:value="handleChange(OptionBasicEnum.WATERMARK_USED, $event)" />
			</n-gi>
			<n-gi :span="3" class="bg-color15 flex-center px-1 rounded-md">
				<img class="h-10 w-full object-contain" :src="formValue.watermark as string"
					v-if="formValue.watermark" />
			</n-gi>
			<n-gi class="flex flex-wrap justify-end" :span="1">
				<upload-file :iconSize="IconSize.Mini" :disabled="!formValue.watermarkUsed"
					@on-change="handleChange(OptionBasicEnum.WATERMARK, $event)"></upload-file>
				<div class="w-full my-1"></div>
				<camera-select @on-choose="handleChange(OptionBasicEnum.WATERMARK, $event)"
					:disabled="!formValue.watermarkUsed"></camera-select>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 水印位置 </n-gi>
			<n-gi :span="5">
				<n-select :options="watermarkPositionOptions" :disabled="!formValue.watermarkUsed"
					v-model:value="formValue.watermarkPosition"
					@update:value="handleChange(OptionBasicEnum.WATERMARK_POSITION, $event)" />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 水印尺寸 </n-gi>
			<n-gi :span="5" class="flex-start">
				<n-slider :step="0.05" :min="0.05" :max="0.8" v-model:value="formValue.watermarkSize"
					@update:value="handleChange(OptionBasicEnum.WATERMARK_SIZE, $event)" />
			</n-gi>
			<n-gi :span="7">
				<n-divider />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 圆角大小 </n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider :step="1" :min="0" :max="50" v-model:value="formValue.roundedSize"
					@update:value="handleChange(OptionBasicEnum.ROUNDED_SIZE, $event)" />
				<span class="w-12 pl-2">{{ formValue.roundedSize }}</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 阴影大小 </n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider :step="0.05" :min="0" :max="1" v-model:value="formValue.shadowSize"
					@update:value="handleChange(OptionBasicEnum.SHADOW_SIZE, $event)" />
				<span class="w-12 pl-2">{{ formValue.shadowSize }}</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 纯色背景 </n-gi>
			<n-gi :span="5" class="flex-center">
				<n-switch size="small" v-model:value="formValue.bgColorUsed"
					@update:value="handleChange(OptionBasicEnum.BG_COLOR_USED, $event)" />
				<n-color-picker class="ml-2" :modes="['hex']" :show-alpha="false" :disabled="!formValue.bgColorUsed"
					v-model:value="formValue.bgColor" @update:value="handleChange(OptionBasicEnum.BG_COLOR, $event)" />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 背景模糊 </n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider :step="10" :min="0" :max="500" v-model:value="formValue.bgBlur"
					@update:value="handleChange(OptionBasicEnum.BG_BLUR, $event)" />
				<span class="w-12 pl-2">{{ formValue.bgBlur }}</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 固定宽高比 </n-gi>
			<n-gi :span="5" class="flex-center">
				<n-switch size="small" v-model:value="formValue.aspectRatioUsed"
					@update:value="handleChange(OptionBasicEnum.ASPECT_RATIO_USED, $event)" />
				<n-select class="ml-2" :options="[]" :disabled="!formValue.aspectRatioUsed"
					v-model:value="formValue.aspectRatio"
					@update:value="handleChange(OptionBasicEnum.ASPECT_RATIO, $event)" />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 输出质量 </n-gi>
			<n-gi :span="5">
				<n-slider :step="2" :min="50" :max="100" v-model:value="formValue.outputQuality"
					@update:value="handleChange(OptionBasicEnum.OUTPUT_QUALITY, $event)" />
			</n-gi>
		</n-grid>
	</div>
</template>
