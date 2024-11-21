<script setup lang="ts">
import { computed } from 'vue'
import { useOptionBasicStore } from '@renderer/store/optionBasic'
import { IconSize, OptionBasicEnum, OptionBasicValues } from '@renderer/interfaces/options'

import { modalOptions, watermarkPositionOptions } from '@renderer/default/default-options'

import UploadFile from '@renderer/components/UploadFile.vue'
import OpenDir from '@renderer/components/openDir.vue'
import cameraSelect from '@renderer/components/CameraSelect.vue'

const store = useOptionBasicStore()

const formValue = computed<OptionBasicValues>(() => {
	return { ...store.getValue() }
})

const handleChange = async (key: OptionBasicEnum, value: string) => {
	store.set(key, value)
}
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
					<open-dir :icon-size="IconSize.Mini" :dir="formValue.outputPath"> </open-dir>
					<upload-file :icon-size="IconSize.Mini" :file-type="'directory'" msg="选择文件目录"
						@on-change="handleChange(OptionBasicEnum.OUTPUT_PATH, $event)">
					</upload-file>
				</n-space>
			</n-gi>
			<n-gi :span="2" class="flex-end">模式</n-gi>
			<n-gi :span="5" class="flex-start">
				<n-space>
					<img v-for="item in modalOptions" :key="item.key"
						class="w-20 cursor-pointer border-2 border-solid rounded-md hover:border-#2080f0"
						:class="[formValue.pattern === item.key ? 'border-#2080f0' : 'border-color15']" :src="item.img"
						@click="handleChange(OptionBasicEnum.PATTERN, item.key)" />
				</n-space>
			</n-gi>
			<n-gi :span="2" class="flex-end">主图占比</n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider v-model:value="formValue.mainImgSize" :step="1" :min="50" :max="100"
					@update:value="handleChange(OptionBasicEnum.MAIN_IMG_SIZE, $event)" />
				<span class="w-12 pl-2">{{ formValue.mainImgSize }}</span>
			</n-gi>
			<n-gi :span="7">
				<n-divider />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 文字背景 </n-gi>
			<n-gi :span="5" class="flex-start">
				<n-switch v-model:value="formValue.textBgColorUsed" size="small"
					@update:value="handleChange(OptionBasicEnum.TEXT_BG_COLOR_USED, $event)" />
				<n-color-picker v-model:value="formValue.textBgColor" class="ml-2" :modes="['hex']" :show-alpha="false"
					:disabled="!formValue.textBgColorUsed"
					@update:value="handleChange(OptionBasicEnum.TEXT_BG_COLOR, $event)" />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 水印 </n-gi>
			<n-gi :span="1" class="flex-between">
				<n-switch v-model:value="formValue.watermarkUsed" size="small"
					@update:value="handleChange(OptionBasicEnum.WATERMARK_USED, $event)" />
			</n-gi>
			<n-gi :span="3" class="bg-color15 flex-center px-1 rounded-md">
				<img v-if="formValue.watermark" class="h-10 w-full object-contain"
					:src="formValue.watermark as string" />
			</n-gi>
			<n-gi class="flex flex-wrap justify-end" :span="1">
				<upload-file :icon-size="IconSize.Mini" :disabled="!formValue.watermarkUsed" msg="上传水印图片"
					@on-change="handleChange(OptionBasicEnum.WATERMARK, $event)"></upload-file>
				<div class="w-full my-1"></div>
				<camera-select :disabled="!formValue.watermarkUsed"
					@on-choose="handleChange(OptionBasicEnum.WATERMARK, $event)"></camera-select>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 水印位置 </n-gi>
			<n-gi :span="5">
				<n-select v-model:value="formValue.watermarkPosition" :options="watermarkPositionOptions"
					:disabled="!formValue.watermarkUsed"
					@update:value="handleChange(OptionBasicEnum.WATERMARK_POSITION, $event)" />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 水印尺寸 </n-gi>
			<n-gi :span="5" class="flex-start">
				<n-slider v-model:value="formValue.watermarkSize" :step="0.05" :min="0.05" :max="0.8"
					@update:value="handleChange(OptionBasicEnum.WATERMARK_SIZE, $event)" />
			</n-gi>
			<n-gi :span="7">
				<n-divider />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 圆角大小 </n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider v-model:value="formValue.roundedSize" :step="1" :min="0" :max="50"
					@update:value="handleChange(OptionBasicEnum.ROUNDED_SIZE, $event)" />
				<span class="w-12 pl-2">{{ formValue.roundedSize }}</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 阴影大小 </n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider v-model:value="formValue.shadowSize" :step="0.05" :min="0" :max="1"
					@update:value="handleChange(OptionBasicEnum.SHADOW_SIZE, $event)" />
				<span class="w-12 pl-2">{{ formValue.shadowSize }}</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 纯色背景 </n-gi>
			<n-gi :span="5" class="flex-center">
				<n-switch v-model:value="formValue.bgColorUsed" size="small"
					@update:value="handleChange(OptionBasicEnum.BG_COLOR_USED, $event)" />
				<n-color-picker v-model:value="formValue.bgColor" class="ml-2" :modes="['hex']" :show-alpha="false"
					:disabled="!formValue.bgColorUsed" @update:value="handleChange(OptionBasicEnum.BG_COLOR, $event)" />
			</n-gi>
			<n-gi :span="2" class="flex-end"> 背景模糊 </n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider v-model:value="formValue.bgBlur" :step="10" :min="0" :max="500"
					@update:value="handleChange(OptionBasicEnum.BG_BLUR, $event)" />
				<span class="w-12 pl-2">{{ formValue.bgBlur }}</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 输出质量 </n-gi>
			<n-gi :span="5" class="flex-start">
				<n-slider v-model:value="formValue.outputQuality" :step="2" :min="10" :max="100"
					@update:value="handleChange(OptionBasicEnum.OUTPUT_QUALITY, $event)" />
			</n-gi>
		</n-grid>
	</div>
</template>
