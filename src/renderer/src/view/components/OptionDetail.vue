<script setup lang="ts">
import { Copy24Regular } from '@vicons/fluent'

import { computed } from 'vue'
import { useMessage } from 'naive-ui'

import { useFileStore } from '@renderer/store/file'
import { exifFields } from '@renderer/default/default-options'

const message = useMessage()
const store = useFileStore()

// 当前预览中的照片
const currentPhoto = computed(() => store._imageData[store._currentPreIndex] || null)

// 可编辑字段（内置 exif 字段，排除图片宽高这类自动项）
const fields = exifFields
	.filter((f) => f.name && f.show !== false)
	.map((f) => ({ key: f.key, name: f.name as string }))

const valueOf = (key: string): string => {
	return (currentPhoto.value?.exif?.exif?.[key] as string) ?? ''
}

// 写回当前照片的 exif，预览实时刷新
const onEdit = (key: string, val: string) => {
	const photo = currentPhoto.value
	if (!photo) return
	photo.exif.exif[key] = val ?? ''
}

// 复制参数
const onCopy = () => {
	const photo = currentPhoto.value
	if (!photo) return
	navigator.clipboard
		.writeText(JSON.stringify(photo.exif.exif, null, 2))
		.then(() => message.success('已复制参数'))
		.catch(() => message.error('复制失败'))
}
</script>

<template>
	<div class="option-detail px-3 pb-6">
		<template v-if="currentPhoto">
			<span class="color6 text-2.5 leading-5">
				缺少 EXIF 的字段可手动填写/修改，改动后预览实时更新。
			</span>
			<div class="relative">
				<img v-if="currentPhoto.perUrl" :src="currentPhoto.perUrl"
					class="block w-full max-h-40 object-cover rounded-lg mb-3 bg-color13" />
				<n-button class="absolute top-2 right-2" size="tiny" type="info" @click="onCopy">
					<template #icon>
						<n-icon :component="Copy24Regular" />
					</template>
				</n-button>
			</div>

			<div class="flex flex-col gap-2">
				<div v-for="field in fields" :key="field.key" class="flex items-center">
					<div class="w-18 flex-shrink-0 text-xs color6 text-right pr-2 truncate" :title="field.name">
						{{ field.name }}
					</div>
					<n-input class="flex-1" size="small" placeholder="未填写" :value="valueOf(field.key)"
						@update:value="(v: string) => onEdit(field.key, v)" />
				</div>
			</div>
		</template>

		<div v-else class="color6 text-sm text-center py-10">请先选择一张照片</div>
	</div>
</template>
