<script setup lang="ts">
import { ArrowMove20Regular, ArrowMoveInward20Regular } from '@vicons/fluent'

import { computed, ref } from 'vue'
import { useOptionBasicStore } from '@renderer/store/optionBasic'
import { IconSize, OptionBasicEnum, OptionBasicValues } from '@renderer/interfaces/options'

import { watermarkPositionOptions, outputFormatOptions } from '@renderer/default/default-options'

import YSlider from '@renderer/components/YSlider.vue'
import UploadFile from '@renderer/components/UploadFile.vue'
import OpenDir from '@renderer/components/openDir.vue'
import cameraSelect from '@renderer/components/CameraSelect.vue'

const store = useOptionBasicStore()

const formValue = computed<OptionBasicValues>(() => {
	return { ...store.getValue() }
})

const handleChange = async (key: OptionBasicEnum, value: string | [number, number, number, number]) => {
	store.set(key, value)
}

// 折叠展开 - 圆角设置
const isOpenRounded = ref(false)
const onChangeRounded = () => {
	isOpenRounded.value = !isOpenRounded.value
}
// 设置 （type: 0 四角 1 左上 2 右上 3 右下 4 左下）
const setRoundedSize = (value: number, type: number) => {
	if (type === 0) {
		const v: [number, number, number, number] = [value, value, value, value]
		handleChange(OptionBasicEnum.ROUNDED_SIZE, v)
	} else {
		const v: [number, number, number, number] = [...formValue.value.roundedSize]
		handleChange(OptionBasicEnum.ROUNDED_SIZE, v)
	}
}

// 折叠展开 - 边框设置
const isOpenBorder = ref(false)
const onChangeBorder = () => {
	isOpenBorder.value = !isOpenBorder.value
}
// 设置 （type: 0 四角 1 左上 2 右上 3 右下 4 左下）
const setBorderSize = (value: number, type: number) => {
	console.log(value, type)
	if (type === 0) {
		const v: [number, number, number, number] = [value, value, value, value]
		handleChange(OptionBasicEnum.BORDER_WIDTH, v)
	} else {
		const v: [number, number, number, number] = [...formValue.value.borderWidth]
		handleChange(OptionBasicEnum.BORDER_WIDTH, v)
	}
}
</script>

<template>
	<div class="option-basic pb-10">
		<n-grid x-gap="6" y-gap="16" :cols="7">
			<n-gi :span="8" class='flex-center'>
				<span class="text-xs text-#666">输出配置</span>
			</n-gi>

			<n-gi :span="2" class="flex-end">输出目录</n-gi>
			<n-gi :span="3">
				<n-ellipsis>
					<span class="text-xs">{{ formValue.outputPath || '无' }}</span>
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

			<n-gi :span="2" class="flex-end"> 输出格式 </n-gi>
			<n-gi :span="5">
				<n-select v-model:value="formValue.outputFormat" :options="outputFormatOptions"
					@update:value="handleChange(OptionBasicEnum.OUTPUT_FORMAT, $event)" />
			</n-gi>

			<n-gi :span="7">
				<n-divider />
			</n-gi>

			<n-gi :span="8" class='flex-center'>
				<span class="text-xs text-#666">水印设置</span>
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
					:disabled="!formValue.watermarkUsed"
					@update:value="handleChange(OptionBasicEnum.WATERMARK_SIZE, $event)" />
			</n-gi>
			<n-gi :span="7">
				<n-divider />
			</n-gi>

			<n-gi :span="8" class='flex-center'>
				<span class="text-xs text-#666">样式设置</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 内容边框 </n-gi>
			<n-gi class="flex-start" :span="5">
				<y-slider class="w-full" v-model:value="formValue.borderSize" :min="6" :max="50" :step="1"
					@on-change="handleChange(OptionBasicEnum.BORDER_SIZE, $event)">
				</y-slider>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 副边框 </n-gi>
			<n-gi class="flex-start" :span="5">
				<div class="w-full">
					<y-slider v-model:value="formValue.borderWidth[0]" :min="0" :max="30" :step="1"
						@on-change="setBorderSize($event, isOpenBorder ? 1 : 0)">
						<div class="w-[16px] h-[16px] bg-color13 border-t-4 border-t-solid border-color11">
						</div>
					</y-slider>
					<y-slider v-if="isOpenBorder" class="mt-2" v-model:value="formValue.borderWidth[1]" :min="0"
						:max="30" :step="1" @on-change="setBorderSize($event, 2)">
						<div class="w-[16px] h-[16px] bg-color13 border-r-4 border-r-solid border-color11">
						</div>
					</y-slider>
					<y-slider v-if="isOpenBorder" class="mt-2" v-model:value="formValue.borderWidth[2]" :min="0"
						:max="30" :step="1" @on-change="setBorderSize($event, 3)">
						<div class="w-[16px] h-[16px] bg-color13 border-b-4 border-b-solid border-color11">
						</div>
					</y-slider>
					<y-slider v-if="isOpenBorder" class="mt-2" v-model:value="formValue.borderWidth[3]" :min="0"
						:max="30" :step="1" @on-change="setBorderSize($event, 4)">
						<div class="w-[16px] h-[16px] bg-color13 border-l-4 border-l-solid border-color11">
						</div>
					</y-slider>
				</div>
				<n-button quaternary circle :type="isOpenBorder ? 'warning' : 'info'" size="tiny"
					@click="onChangeBorder">
					<template #icon>
						<n-icon :component="isOpenBorder ? ArrowMoveInward20Regular : ArrowMove20Regular" />
					</template>
				</n-button>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 圆角大小 </n-gi>
			<n-gi class="flex-start" :span="5">
				<div class="w-full">
					<y-slider v-model:value="formValue.roundedSize[0]" :min="0" :max="50" :step="1"
						@on-change="setRoundedSize($event, isOpenRounded ? 1 : 0)">
						<div
							class="w-[16px] h-[16px]  border-l-2 border-t-2 border-l-solid border-t-solid border-color11 rounded-lt-md">
						</div>
					</y-slider>
					<y-slider v-if="isOpenRounded" class="mt-2" v-model:value="formValue.roundedSize[1]" :min="0"
						:max="50" :step="1" @on-change="setRoundedSize($event, 2)">
						<div
							class="w-[16px] h-[16px]  border-r-2 border-t-2 border-r-solid border-t-solid border-color11 rounded-rt-md">
						</div>
					</y-slider>
					<y-slider v-if="isOpenRounded" class="mt-2" v-model:value="formValue.roundedSize[2]" :min="0"
						:max="50" :step="1" @on-change="setRoundedSize($event, 3)">
						<div
							class="w-[16px] h-[16px]  border-r-2 border-b-2 border-r-solid border-b-solid border-color11 rounded-rb-md">
						</div>
					</y-slider>
					<y-slider v-if="isOpenRounded" class="mt-2" v-model:value="formValue.roundedSize[3]" :min="0"
						:max="50" :step="1" @on-change="setRoundedSize($event, 4)">
						<div
							class="w-[16px] h-[16px]  border-l-2 border-b-2 border-l-solid border-b-solid border-color11 rounded-lb-md">
						</div>
					</y-slider>
				</div>
				<n-button quaternary circle :type="isOpenRounded ? 'warning' : 'info'" size="tiny"
					@click="onChangeRounded">
					<template #icon>
						<n-icon :component="isOpenRounded ? ArrowMoveInward20Regular : ArrowMove20Regular" />
					</template>
				</n-button>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 阴影大小 </n-gi>
			<n-gi class="flex-start" :span="5">
				<n-slider v-model:value="formValue.shadowSize" :step="0.05" :min="0" :max="1"
					@update:value="handleChange(OptionBasicEnum.SHADOW_SIZE, $event)" />
				<span class="w-12 pl-2">{{ formValue.shadowSize }}</span>
			</n-gi>
			<n-gi :span="2" class="flex-end"> 文字背景 </n-gi>
			<n-gi :span="5" class="flex-start">
				<n-switch v-model:value="formValue.textBgColorUsed" size="small"
					@update:value="handleChange(OptionBasicEnum.TEXT_BG_COLOR_USED, $event)" />
				<n-color-picker v-model:value="formValue.textBgColor" class="ml-2" :modes="['hex']" :show-alpha="false"
					:disabled="!formValue.textBgColorUsed"
					@update:value="handleChange(OptionBasicEnum.TEXT_BG_COLOR, $event)" />
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
				<span class="w-12 pl-2">{{ formValue.outputQuality }}%</span>
			</n-gi>
		</n-grid>
	</div>
</template>
