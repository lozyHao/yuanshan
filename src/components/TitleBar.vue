<script setup lang="ts">
import {
	WeatherSunnyLow20Regular,
	WeatherMoon24Regular,
	Settings24Filled,
	QuestionCircle24Regular,
	Star24Regular,
} from "@vicons/fluent";
import { OptionsOutline } from "@vicons/ionicons5";

import { computed, ref } from "vue";

import { useThemeStore } from "@/store/theme.ts";

import OptionBox from "./OptionDefault.vue";

// 配置弹窗
const showOptionBox = ref<boolean>(false);

const themeStore = useThemeStore();
const translateY = computed(() => {
	if (themeStore.isDark()) {
		return "translate-y-0";
	}
	return "translate-y--8";
});

const onChange = () => {
	themeStore.setTheme();
};
</script>
<template>
	<div class="title-bar flex-between w-full h-full">
		<div class="flex-center">
			<img class="h-8" src="@/assets/images/logo.png">
			<span class="color-013D3A font-bold text-base ml-2">远 山</span>
		</div>
		<div class="drag-box flex-1 h-full"></div>
		<div class="flex-center">
			<n-popover trigger="hover" :show-arrow="false">
				<template #trigger>
					<div class="flex-center menu-hover h-12 w-12 color3 cursor-pointer transition-all"
						@click="showOptionBox = true">
						<n-icon :size="20">
							<OptionsOutline />
						</n-icon>
					</div>
				</template>
				<span>通用配置</span>
			</n-popover>
			<n-popover trigger="hover" :show-arrow="false">
				<template #trigger>
					<div class="flex-center menu-hover w-12 h-12 cursor-pointer transition-all">
						<n-icon class="color3 transition-all hover:transform-rotate-180" :size="20">
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
									<WeatherSunnyLow20Regular />
								</n-icon>
							</div>
							<div class="w-8 h-8 flex justify-center items-center transition-all" :class="[translateY]">
								<n-icon size="24" class="color3">
									<WeatherMoon24Regular />
								</n-icon>
							</div>
						</div>
						<span class="color3 pl-2">切换主题</span>
					</div>
					<div class="menu-hover flex items-center p-1 rounded-md transition-colors cursor-pointer">
						<div class="w-8 h-8 flex items-center justify-center">
							<n-icon size="24" class="color3">
								<QuestionCircle24Regular />
							</n-icon>
						</div>
						<span class="color3 pl-2">常见问题解答</span>
					</div>
					<div class="menu-hover flex items-center p-1 rounded-md transition-colors cursor-pointer">
						<div class="w-8 h-8 flex items-center justify-center">
							<n-icon size="24" class="color3">
								<Star24Regular />
							</n-icon>
						</div>
						<span class="color3 pl-2">支持一下</span>
					</div>
				</div>
			</n-popover>
		</div>

		<option-box v-model:show="showOptionBox"></option-box>
	</div>
</template>


<style lang="less" scoped>
.drag-box {
	-webkit-app-region: drag;
}
</style>