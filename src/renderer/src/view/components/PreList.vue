<!-- 预设模式下文件列表 -->
<script setup lang="ts">
import { Add24Filled } from '@vicons/fluent'
import { Close } from '@vicons/ionicons5'

import ImageData from '@renderer/hooks/imageData'
import { useFileStore } from '@renderer/store/file'
import { computed, ref } from 'vue'
import { useDialog, useMessage } from 'naive-ui'

const store = useFileStore()
const message = useMessage()
const dialog = useDialog()

const list = computed<ImageData[]>(() => store._imageData)
const currentIndex = computed<number>(() => store._currentPreIndex)
const contentWidth = computed<number>(() => list.value.length * 72)

// 切图
const onPre = (index: number | null) => {
	store.setCurrentPreIndex(index || 0)
}

// 上传文件
const handleFileChange = async (e: Event) => {
	const t = e.target as HTMLInputElement
	const isRepetition = await store.addFiles(Array.from(t.files as FileList))
	if (isRepetition) {
		message.success(isRepetition)
	}
	// 选择结束
	t.value = ''
}

const listBox = ref<Element | null>(null)
const isDragging = ref(false)
const scrollSpeed = 50 // 滚动速度
const handleMouseEnter = () => {
	isDragging.value = true
}
const handleMouseLeave = () => {
	isDragging.value = false
}
const handleWheel = (event: WheelEvent) => {
	if (!isDragging.value) return
	// 防止默认的滚轮行为（滚动页面）
	event.preventDefault()
	// 根据滚轮方向计算滚动距离
	const scrollAmount = event.deltaY > 0 ? scrollSpeed : -scrollSpeed
	// 滚动内容
	if (!listBox.value) return
	listBox.value.scrollLeft += scrollAmount
}

// 移除文件
const removeFile = (item: ImageData) => {
	dialog.warning({
		title: '移除图片',
		content: '确定移除该图片吗?',
		positiveText: '确定',
		negativeText: '取消',
		onPositiveClick: () => {
			setTimeout(() => store.removeFile(item.key), 200)
		}
	})
}
</script>

<template>
	<div class="pre-list flex-center border-color14 border-t-2 border-t-solid h-full w-full">
		<div ref="listBox" class="list bg-color15 default-layout h-full overflow-y-hidden overflow-x-auto"
			@mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @wheel="handleWheel">
			<div class="flex h-full py-1" :style="{ width: contentWidth + 'px' }">
				<div v-for="(item, index) in list" :key="item.key"
					class="bg-color3 border-3 border-solid hover:border-#2080f0 h-full w-20 mx-1 overflow-hidden rounded-md relative group "
					:class="index === currentIndex ? 'border-#2080f0' : ''" @click="onPre(index)">
					<n-image class="w-full h-full object-contain flex justify-center cursor-pointer" preview-disabled
						lazy :src="item.perUrl" />
					<!-- 移除按钮 -->
					<n-icon
						class="bg-color-error absolute top-0 right-0 cursor-pointer rounded-full invisible group-hover:visible"
						@click.stop="removeFile(item)" :component="Close" size="14" color="#fff" />

					<!-- exif加载完成 、预览图已生成 提示块 -->
					<div class="absolute bottom-[2px] left-0 flex-start w-full px-[2px]">
						<div class="bg-color-info w-2 h-2 rounded-full border-1 border-solid border-#fff"
							v-show="item.exif.exif"></div>
						<div class="bg-color-success w-2 h-2 rounded-full ml-1 border-1 border-solid border-#fff"
							v-show="item.outerUrl">
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="bg-color13 w-16 h-full overflow-hidden cursor-pointer relative">
			<n-button class="w-full h-full" type="info" strong secondary>
				<template #icon>
					<n-icon :component="Add24Filled"></n-icon>
				</template>
			</n-button>
			<input class="absolute top-0 left-0 w-full h-full cursor-pointer opacity-0" type="file" multiple
				accept="image/jpg,image/jpeg,image/png" @change="handleFileChange" />
		</div>
	</div>
</template>
<style lang="less" scoped>
.list {
	width: calc(100% - 64px);
}
</style>
