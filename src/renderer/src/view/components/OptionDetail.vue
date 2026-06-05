<script setup lang="ts">
import { Copy24Regular, ArrowReset24Regular } from '@vicons/fluent'

import { computed, ref } from 'vue'
import { useMessage } from 'naive-ui'

import { useFileStore } from '@renderer/store/file'
import { exifFields } from '@renderer/default/default-options'

const message = useMessage()
const store = useFileStore()

// 当前预览中的照片
const currentPhoto = computed(() => store._imageData[store._currentPreIndex] || null)

// 只读字段（图片宽高，自动读取、仅展示不可编辑）
const READONLY_KEYS = ['Image Width', 'Image Height']

// 详情字段：可编辑的内置字段 + 只读的宽高
const fields = exifFields
	.filter((f) => f.name && (f.show !== false || READONLY_KEYS.includes(f.key)))
	.map((f) => ({
		key: f.key,
		name: f.name as string,
		editable: !READONLY_KEYS.includes(f.key)
	}))

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

// 重置：重新读取该照片的原始元数据，覆盖手动修改
const resetting = ref(false)
const onReset = async () => {
	const photo = currentPhoto.value
	if (!photo || resetting.value) return
	resetting.value = true
	try {
		await photo.exif.load(photo.exif.file)
		// 重置后主动刷新预览
		store.refreshPreview()
		message.success('已重置为原始元数据')
	} catch {
		message.error('重置失败')
	} finally {
		resetting.value = false
	}
}
</script>

<template>
	<div class="option-detail px-3 pb-6">
		<template v-if="currentPhoto">
			<span class="color6 text-2.5 leading-5">
				缺少 EXIF 的字段可手动填写/修改，改动后预览实时更新。
			</span>
			<div class="flex gap-1 justify-end my-2">
				<n-button size="tiny" type="warning" :loading="resetting" title="重置为原始元数据" @click="onReset">
					<template #icon>
						<n-icon :component="ArrowReset24Regular" />
					</template>
					重置
				</n-button>
				<n-button size="tiny" type="info" title="复制参数" @click="onCopy">
					<template #icon>
						<n-icon :component="Copy24Regular" />
					</template>
					复制参数
				</n-button>
			</div>

			<div class="flex flex-col gap-2">
				<div v-for="field in fields" :key="field.key" class="flex items-center">
					<div class="w-18 flex-shrink-0 text-xs color6 text-right pr-2 truncate" :title="field.name">
						{{ field.name }}
					</div>
					<n-input v-if="field.editable" class="flex-1" size="small" placeholder="未填写"
						:value="valueOf(field.key)" @update:value="(v: string) => onEdit(field.key, v)" />
					<div v-else
						class="flex-1 text-xs color9 px-2 h-7 flex items-center bg-color13 rounded border-1 border-solid border-color15 truncate"
						:title="valueOf(field.key)">
						{{ valueOf(field.key) || '-' }}
					</div>
				</div>
			</div>
		</template>

		<div v-else class="color6 text-sm text-center py-10">请先选择一张照片</div>
	</div>
</template>
