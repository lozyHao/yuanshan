<script setup lang="ts">
import {
	WeatherSunnyLow20Regular,
	WeatherMoon24Regular,
	Settings24Filled,
	QuestionCircle24Regular,
	Star24Regular,
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

// 问题解答列表
const questionOptions = [
	{
		id: 1,
		title: '输出设置目录',
		content: '首页—>配置—>输出目录。输出格式：支持png、jpeg和webp三种格式输出。'
	},
	{
		id: 2,
		title: '水印和边框区别',
		content: '水印是存在图片内部的图片内容；边框是相机exif信息内容和自定义内容的展示。'
	},
	{
		id: 3,
		title: '文字模板',
		content: '是相机参数的组合内容，默认使用文字模板样式。'
	},
	{
		id: 4,
		title: '相机参数',
		content: '照片自带的exif信息，如果是利用修图软件ps、lr等，在导出照片时勾选“元数据”选项，否则导出照片中无exif信息，在读取时就无法读取到。可通过强制替换样式优先使用。'
	},
	{
		id: 5,
		title: '自定义相机参数',
		content: '除相机exif信息外的自定义内容，可以是文本，也可以是图片，注意文本不要过长，否则生成UI不美观。'
	},
	{
		id: 6,
		title: '文字中线设置',
		content: '文字模板—>标题后按钮—>设置。通过设置文字中线和字体大小来控制文字每一行的位置。'
	}
];

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
				textStore.resetTextPosition()
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
				<div class="menu-hover flex items-center p-1 rounded-md transition-colors cursor-pointer">
					<div class="w-8 h-8 flex items-center justify-center">
						<n-icon size="24" class="color3">
							<QuestionCircle24Regular />
						</n-icon>
					</div>
				</div>
			</template>
			<div class="list w-100">
				<div class="color3 py-2 mb-4 text-center bg-color13 rounded-lg">使用说明</div>
				<n-collapse accordion arrow-placement="right">
					<n-collapse-item v-for="item in questionOptions" :key="item.id" :title="item.title" :name="item.id">
						<div>{{ item.content }}</div>
					</n-collapse-item>
				</n-collapse>
			</div>
		</n-popover>
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
					<n-popover trigger="hover" placement="left-start" :show-arrow="false">
						<template #trigger>
							<div class="menu-hover flex items-center p-1 rounded-md transition-colors cursor-pointer">
								<div class="w-8 h-8 flex items-center justify-center">
									<n-icon size="24" class="color3">
										<Star24Regular />
									</n-icon>
								</div>
								<span class="color3 pl-2">支持一下</span>
							</div>
						</template>
						<img class="w-50 h-50 rounded-lg" src="@renderer/assets/images/support_me.png" alt="">
					</n-popover>

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
