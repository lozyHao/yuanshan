<script setup lang="ts">

import { WeatherSunnyLow24Filled, WeatherMoon24Filled, Settings24Filled, QuestionCircle24Filled, Star24Filled } from '@vicons/fluent'

import { computed } from 'vue';
import { useThemeStore } from '@/store/theme.ts';

const themeStore = useThemeStore()
const translateY = computed(() => {
	if (themeStore.isDark()) {
		return 'translate-y-0'
	}
	return 'translate-y--8'
})

const onChange = () => {
	themeStore.setTheme()
}
</script>

<template>
	<div class="nav-bar w-100% h-15 bg-opacity4-fff transition-duration-300 flex justify-between items-center px-10">
		<div class="flex items-center">
			<img class="h-10 w-auto" src="@/assets/images/logo.png" alt="">
			<span class="color-013D3A text-xl font-bold pl-3">远 山</span>
		</div>
		<n-popover class="pop-bg" trigger="click" :show-arrow="false">
			<template #trigger>
				<div class="w-8 h-8 flex justify-center items-center cursor-pointer">
					<n-icon class="color3 transition-colors" size="24">
						<Settings24Filled />
					</n-icon>
				</div>
			</template>
			<div class="w-45 h-auto">
				<div class="menu-hover flex items-center p-1 rounded-md transition-colors cursor-pointer"
					@click="onChange">
					<div class="theme-change-btn w-8 h-8 overflow-hidden">
						<div class="w-8 h-8 flex justify-center items-center transition-all" :class="[translateY]">
							<n-icon size="24" class="color3">
								<WeatherSunnyLow24Filled />
							</n-icon>
						</div>
						<div class="w-8 h-8 flex justify-center items-center transition-all" :class="[translateY]">
							<n-icon size="24" class="color3">
								<WeatherMoon24Filled />
							</n-icon>
						</div>
					</div>
					<span class="color3 pl-2">切换主题</span>
				</div>
				<div class="menu-hover flex items-center p-1 rounded-md transition-colors cursor-pointer">
					<div class=" w-8 h-8 flex items-center justify-center">
						<n-icon size="24" class="color3">
							<QuestionCircle24Filled />
						</n-icon>
					</div>
					<span class="color3 pl-2">常见问题解答</span>
				</div>
				<div class="menu-hover flex items-center p-1 rounded-md transition-colors cursor-pointer">
					<div class=" w-8 h-8 flex items-center justify-center">
						<n-icon size="24" class="color3">
							<Star24Filled />
						</n-icon>
					</div>
					<span class="color3 pl-2">支持一下</span>
				</div>
			</div>
		</n-popover>
	</div>
</template>

<style lang="less" scoped>
.nav-bar {
	backdrop-filter: blur(4px);
}
</style>