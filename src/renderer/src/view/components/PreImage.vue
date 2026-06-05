<!-- 预览模式下，图片预览效果（支持缩放/拖拽） -->
<script setup lang="ts">
import { ZoomIn24Regular, ZoomOut24Regular, ArrowReset24Regular } from '@vicons/fluent'

import { useFileStore } from '@renderer/store/file'
import { computed, ref, watch } from 'vue'

import ImageData from '@renderer/hooks/imageData'

const store = useFileStore()

const list = computed<ImageData[]>(() => store._imageData)
const url = computed(() => {
	if (list.value.length > 0) {
		return (
			list.value[store._currentPreIndex]?.outerUrl || list.value[store._currentPreIndex]?.perUrl
		)
	}
	return ''
})

const DEFAULT_SCALE = 0.9
const MIN_SCALE = 0.1
const MAX_SCALE = 8

const scale = ref(DEFAULT_SCALE)
const tx = ref(0)
const ty = ref(0)

const viewport = ref<HTMLDivElement | null>(null)

const clamp = (v: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, v))

const reset = () => {
	scale.value = DEFAULT_SCALE
	tx.value = 0
	ty.value = 0
}

// 切换照片时重置视图（同一张照片实时重绘不重置）
watch(() => store._currentPreIndex, reset)

const zoomIn = () => (scale.value = clamp(scale.value * 1.2))
const zoomOut = () => (scale.value = clamp(scale.value / 1.2))

// 滚轮缩放（以光标位置为锚点，缩放时光标处图像内容保持不动）
const onWheel = (e: WheelEvent) => {
	const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
	const newScale = clamp(scale.value * factor)
	if (newScale === scale.value) return
	const rect = viewport.value?.getBoundingClientRect()
	if (rect) {
		const cx = e.clientX - rect.left - rect.width / 2
		const cy = e.clientY - rect.top - rect.height / 2
		const ratio = newScale / scale.value
		tx.value = cx - (cx - tx.value) * ratio
		ty.value = cy - (cy - ty.value) * ratio
	}
	scale.value = newScale
}

// 拖拽平移
const dragging = ref(false)
let startX = 0
let startY = 0
let startTx = 0
let startTy = 0
const onDown = (e: MouseEvent) => {
	dragging.value = true
	startX = e.clientX
	startY = e.clientY
	startTx = tx.value
	startTy = ty.value
	window.addEventListener('mousemove', onMove)
	window.addEventListener('mouseup', onUp)
}
const onMove = (e: MouseEvent) => {
	if (!dragging.value) return
	tx.value = startTx + (e.clientX - startX)
	ty.value = startTy + (e.clientY - startY)
}
const onUp = () => {
	dragging.value = false
	window.removeEventListener('mousemove', onMove)
	window.removeEventListener('mouseup', onUp)
}
</script>

<template>
	<div ref="viewport" class="pre-image w-full h-full relative overflow-hidden flex-center"
		:style="{ cursor: dragging ? 'grabbing' : 'grab' }" @wheel.prevent="onWheel" @mousedown.prevent="onDown">
		<img class="max-w-full max-h-full object-contain select-none" :src="url" draggable="false" :style="{
			transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
			transition: dragging ? 'none' : 'transform 0.08s ease-out'
		}" />

		<!-- 缩放控件 -->
		<div
			class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/40 rounded-full px-2 py-1 shadow-md"
			@mousedown.stop @wheel.stop>
			<n-button quaternary circle size="small" @click="zoomOut">
				<template #icon>
					<n-icon :component="ZoomOut24Regular" />
				</template>
			</n-button>
			<span class="text-xs color6 w-12 text-center cursor-pointer select-none" title="还原" @click="reset">
				{{ Math.round(scale * 100) }}%
			</span>
			<n-button quaternary circle size="small" @click="zoomIn">
				<template #icon>
					<n-icon :component="ZoomIn24Regular" />
				</template>
			</n-button>
			<n-button quaternary circle size="small" title="还原" @click="reset">
				<template #icon>
					<n-icon :component="ArrowReset24Regular" />
				</template>
			</n-button>
		</div>
	</div>
</template>

<style lang="less" scoped></style>
