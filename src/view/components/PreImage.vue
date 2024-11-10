<!-- 预览模式下，图片预览效果 -->
<script setup lang="ts">
import { useFileStore } from '@/store/file';
import { computed } from 'vue';

import ImageData from '@/hooks/imageData'

const store = useFileStore();

const list = computed<ImageData[]>(() => store._imageData)
const url = computed(() => {
	if (list.value.length > 0) {
		return list.value[store._currentPreIndex]?.outerUrl || list.value[store._currentPreIndex]?.perUrl
	}
	return ''
})

</script>

<template>
	<div class="pre-image w-full h-full max-w-200 max-h-200 flex-center rounded-[4px] overflow-hidden">
		<img class="w-full h-full object-contain" :src="url" />
	</div>
</template>

<style lang="less" scoped>
.pre-image {
	box-shadow: rgba(0, 0, 0, .6) 0 0 20px 2px;
}
</style>
