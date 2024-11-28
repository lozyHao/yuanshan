<script setup lang="ts">
import {
	WeatherSunnyLow20Regular,
	WeatherMoon24Regular,
	Settings24Filled,
	// QuestionCircle24Regular,
	// Star24Regular,
	Toolbox24Filled,
	DrawText20Filled
} from '@vicons/fluent'
import { ClearOutlined } from '@vicons/antd'
import { FormatColorTextRound } from '@vicons/material'

import { computed, onMounted, ref } from 'vue'
import { useMessage } from 'naive-ui'

import { useThemeStore } from '@renderer/store/theme'
import { useOptionBasicStore } from '@renderer/store/optionBasic'
import { useOptionTextStore } from '@renderer/store/optionText'
import { useOptionLensStore } from '@renderer/store/optionLens'

import PopCanvasSign from './PopCanvasSign.vue'
import PopDrawingBoard from './PopDrawingBoard.vue'

const themeStore = useThemeStore()
const basicStore = useOptionBasicStore()
const textStore = useOptionTextStore()
const lensStore = useOptionLensStore()

const message = useMessage()

const translateY = computed(() => {
	if (themeStore.isDark()) {
		return 'translate-y-0'
	}
	return 'translate-y--8'
})

const onChange = () => {
	themeStore.setTheme()
}

// 清除数据
const options = ref(['basic', 'text', 'lens'])

const onClear = () => {
	for (let i = 0; i < options.value.length; i++) {
		switch (options.value[i]) {
			case 'basic':
				basicStore.reset()
				break
			case 'text':
				textStore.reset()
				break
			case 'lens':
				lensStore.reset()
				break
		}
	}
	message.success('恢复成功')
}

// 字体转图片
const canvasSignPopShow = ref(false)
// 画板
const drawingBoardPopShow = ref(false)


const isDevice = ref<string>('no')
const checkDevice = () => {
	console.log(navigator)
	const platform = navigator.userAgent.toLowerCase();
	if (platform.includes('win')) {
		isDevice.value = 'win'
		return
	} else if (platform.includes('mac')) {
		isDevice.value = 'mac'
		return
	}

	isDevice.value = 'other'
}

onMounted(() => {
	checkDevice()
})
</script>
<template>
	<div class="title-bar flex-between w-full h-full"
		:class="{ 'pr-32': isDevice === 'win' || isDevice === 'other', 'pl-16': isDevice === 'mac' || isDevice === 'other' }">
		<div class="flex-center" :class="{}">
			<img class="h-8" src="@renderer/assets/images/logo.png" />
			<span class="color-013D3A font-bold text-base ml-2">远 山</span>
		</div>
		<div class="drag-box flex-1 h-full"></div>
		<n-popover trigger="hover" :show-arrow="false">
			<template #trigger>
				<div class="flex-center menu-hover w-12 h-12 cursor-pointer transition-all">
					<n-icon class="color3" :size="20">
						<Toolbox24Filled />
					</n-icon>
				</div>
			</template>
			<div class="w-45 h-auto">
				<div class="menu-hover flex items-center p-1 rounded-md transition-colors cursor-pointer"
					@click="canvasSignPopShow = true">
					<div class="w-8 h-8 flex items-center justify-center">
						<n-icon size="24" class="color3">
							<FormatColorTextRound />
						</n-icon>
					</div>
					<span class="color3 pl-2">字体转图片</span>
				</div>
				<div class="menu-hover flex items-center p-1 rounded-md transition-colors cursor-pointer"
					@click="drawingBoardPopShow = true">
					<div class="w-8 h-8 flex items-center justify-center">
						<n-icon size="24" class="color3">
							<DrawText20Filled />
						</n-icon>
					</div>
					<span class="color3 pl-2">画板</span>
				</div>
			</div>
		</n-popover>
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
					<!-- <div class="menu-hover flex items-center p-1 rounded-md transition-colors cursor-pointer">
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
					</div> -->
				</div>
			</n-popover>
		</div>
		<pop-canvas-sign v-model:show="canvasSignPopShow"></pop-canvas-sign>
		<pop-drawing-board v-model:show="drawingBoardPopShow"></pop-drawing-board>
	</div>
</template>

<style lang="less" scoped>
.drag-box {
	-webkit-app-region: drag;
}
</style>
