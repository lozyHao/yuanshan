<script setup lang="ts">
import { ChevronDoubleUp20Filled } from '@vicons/fluent'

import { ref } from 'vue';


// 是否展开
const isOpenOptionBox = ref<boolean>(false);
const onOpenOptionBox = () => {
	isOpenOptionBox.value = !isOpenOptionBox.value
}
</script>

<template>
	<div class="option-box bg-color15 relative transition-duration-500  rounded-tr-xl rounded-tl-xl"
		:style="{ height: isOpenOptionBox ? '60%' : '0px' }">
		<div class="go-open h-10 w-full absolute top--10 items-center justify-center cursor-pointer"
			:class="[isOpenOptionBox ? 'hidden' : 'flex']" @click="onOpenOptionBox">
			<n-icon class="go-open-icon text-#eee" size="32">
				<ChevronDoubleUp20Filled />
			</n-icon>
		</div>
		<div class="relative">
			<div class="close-btn bg-color9 w-30 h-[6px] hover:h-[10px] rounded-[3px] my-3 mx-auto cursor-pointer transition-all absolute left-0 right-0"
				@click="onOpenOptionBox">
			</div>
			<div class="content">
				内容
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
.option-box {
	width: calc(100% - 160px);
	max-width: 1280px;
}

.go-open {

	.go-open-icon {
		animation: ani 2s infinite;
	}

	@keyframes ani {
		0% {
			transform: translateY(5px);
			opacity: 0.2;
		}

		40% {
			transform: translateY(-15px);
			opacity: 1;
		}

		100% {
			transform: translateY(5px);
			opacity: 0.2;
		}
	}
}
</style>