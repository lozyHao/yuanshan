<script setup lang="ts">
import {
	WeatherSunnyLow20Regular,
	WeatherMoon24Regular,
	Settings24Filled,
	QuestionCircle24Regular,
	Star24Regular,
} from "@vicons/fluent";
import { ClearOutlined } from '@vicons/antd'

import { computed, ref } from "vue";

import { useThemeStore } from "@/store/theme.ts";
import { useOptionBasicStore } from '@/store/optionBasic.ts'
import { useOptionTextStore } from '@/store/optionText.ts'
import { useOptionLensStore } from '@/store/optionLens.ts'
import { useMessage } from "naive-ui";

const themeStore = useThemeStore();
const basicStore = useOptionBasicStore()
const textStore = useOptionTextStore()
const lensStore = useOptionLensStore()

const message = useMessage()

const translateY = computed(() => {
	if (themeStore.isDark()) {
		return "translate-y-0";
	}
	return "translate-y--8";
});

const onChange = () => {
	themeStore.setTheme();
};

// 清除数据
const options = ref(["basic", "text", "lens"])

const onClear = () => {
	for (let i = 0; i < options.value.length; i++) {
		switch (options.value[i]) {
			case "basic":
				basicStore.reset()
				break;
			case "text":
				textStore.reset()
				break;
			case "lens":
				lensStore.reset()
				break;
		}
	}
	message.success("恢复成功")
}
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
					<div class="flex-center menu-hover w-12 h-12 cursor-pointer transition-all">
						<n-icon class="color3" :size="20">
							<ClearOutlined />
						</n-icon>
					</div>
				</template>
				<n-checkbox-group v-model:value="options">
					<n-grid class="py-2" :y-gap="8" :cols="3">
						<n-gi :span="2" class="flex-center">
							<span class="text-sm color6">清空所有配置项，恢复到初始默认配置</span>
						</n-gi>
						<n-gi :span="1" class="flex-end">
							<n-button type="warning" size="tiny" @click="onClear">恢复默认</n-button>
						</n-gi>
						<n-gi>
							<n-checkbox value="basic" size="small" label="基础配置" />
						</n-gi>
						<n-gi>
							<n-checkbox value="text" size="small" label="文字模板" />
						</n-gi>
						<n-gi>
							<n-checkbox value="lens" size="small" label="相机参数" />
						</n-gi>

					</n-grid>
				</n-checkbox-group>
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
	</div>
</template>


<style lang="less" scoped>
.drag-box {
	-webkit-app-region: drag;
}
</style>