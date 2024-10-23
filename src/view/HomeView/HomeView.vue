<script lang="ts" setup>
import NavBar from './components/NavBar.vue';
import StartBox from './components/StartBox.vue';

</script>
<template>
	<div class="home">
		<div class="shade"></div>
		<div class="w-full h-full relative flex flex-col items-center">
			<nav-bar class="position-relative" />
			<start-box></start-box>
		</div>
	</div>
</template>

<style lang="less" scoped>
.home {
	height: 100%;
	width: 100%;
	overflow: hidden;
	background-image: @home-bg-img;
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;

	// 背景高斯模糊
	.shade::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		backdrop-filter: blur(10px);
	}
}
</style>