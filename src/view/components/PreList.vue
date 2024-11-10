<!-- 预设模式下文件列表 -->
<script setup lang="ts">
import { Add24Filled } from "@vicons/fluent";

import ImageData from "@/hooks/imageData";
import { useFileStore } from '@/store/file.ts'
import { computed, ref } from "vue";
import { useMessage } from 'naive-ui'

const store = useFileStore();
const message = useMessage()

const list = computed<ImageData[]>(() => store._imageData)
const currentIndex = computed<number>(() => store._currentPreIndex)
const contentWidth = computed<number>(() => list.value.length * 72);

// 切图
const onPre = (index: number | null) => {
	store.setCurrentPreIndex(index || 0);
};

// 上传文件
const handleFileChange = async (e: Event) => {
	const t = e.target as HTMLInputElement
	const isRepetition = await store.addFiles(Array.from(t.files as FileList))
	if (isRepetition) {
		message.warning(isRepetition)
	}
	// 选择结束
	t.value = ''
}

const listBox = ref<Element | null>(null);
const isDragging = ref(false);
const scrollSpeed = 50; // 滚动速度
const handleMouseEnter = () => {
	isDragging.value = true;
};
const handleMouseLeave = () => {
	isDragging.value = false;
};
const handleWheel = (event: WheelEvent) => {
	if (!isDragging.value) return;
	// 防止默认的滚轮行为（滚动页面）
	event.preventDefault();
	// 根据滚轮方向计算滚动距离
	const scrollAmount = event.deltaY > 0 ? scrollSpeed : -scrollSpeed;
	// 滚动内容
	if (!listBox.value) return
	listBox.value.scrollLeft += scrollAmount;
};
</script>

<template>
	<div class="pre-list flex-center border-color14 border-t-2 border-t-solid h-full w-full">
		<div class="list bg-color15 default-layout h-full overflow-y-hidden overflow-x-auto"
			@mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" @wheel="handleWheel" ref="listBox">
			<div class="flex h-full py-1" :style="{ width: contentWidth + 'px' }">
				<div v-for="(item, index) in list" :key="item.key"
					class="bg-color3 border-3 border-solid hover:border-#2080f0 h-full w-20 mx-1 object-contain overflow-hidden rounded-md cursor-pointer"
					:class="index === currentIndex ? 'active' : ''" @click="onPre(index)">
					<img class="h-full w-full object-contain" :src="item.perUrl" alt="" />
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
				accept="image/jpg,image/jpeg,image/png" @change="handleFileChange">
		</div>
	</div>
</template>
<style lang="less" scoped>
.active {
	border-color: #2080f0;
}

.list {
	width: calc(100% - 64px);
}
</style>
