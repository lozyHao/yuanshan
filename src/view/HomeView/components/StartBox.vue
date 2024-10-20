<script setup lang="ts">

</script>

<template>
	<div class="start-box flex-1 rounded-xl my-10 flex overflow-hidden drop-shadow-lg">
		<div class="h-full flex-1 min-w-60 flex flex-col items-center justify-center">
			<div
				class="bg-opacity3-fff color-013D3A font-bold text-xl w-90% max-w-70 h-12 flex items-center justify-center rounded-xl transition-colors cursor-pointer">
				即刻创作
			</div>
			<div class="h-5"></div>
			<div
				class="bg-opacity3-fff text-#fff text-sm w-30 h-12 flex items-center justify-center rounded-xl transition-colors cursor-pointer">
				快速输出
			</div>
		</div>
		<div class="bg-color15 w-80% max-w-180 h-full bg-#fff transition-all">
			文件列表
		</div>
	</div>
</template>

<style lang="less" scoped>
.start-box {
	width: calc(100% - 160px);
	max-width: 1280px;
	min-height: 160px;
	max-height: 520px;
	background-image: @home-bg-img;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
}
</style>