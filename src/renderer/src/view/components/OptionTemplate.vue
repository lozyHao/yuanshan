<script setup lang="ts">
import { useMessage } from 'naive-ui'

import { presetTemplates, PresetTemplate } from '@renderer/default/preset-templates'
import { useConfigIO } from '@renderer/hooks/useConfigIO'

const message = useMessage()
const { applyConfigData } = useConfigIO()

const onApply = (preset: PresetTemplate) => {
	applyConfigData(preset.data)
	message.success(`已应用模板：${preset.name}`)
}

// —— 依据预设的基础配置生成缩略图样式，直观示意实际边框效果 ——
const basicOf = (p: PresetTemplate) => p.data.basic!

// 外框（背景/边框）：纯色用色值，毛玻璃用渐变示意
const frameStyle = (p: PresetTemplate) => {
	const b = basicOf(p)
	return {
		background: b.bgColorUsed
			? b.bgColor || '#ffffff'
			: 'linear-gradient(135deg, #7c8794, #2f3741)'
	}
}

// 主图圆角（按缩略图比例缩小）
const photoRadius = (p: PresetTemplate) => {
	const r = basicOf(p).roundedSize?.[0] ?? 0
	return `${Math.min(Math.round(r / 4), 6)}px`
}

const hasBar = (p: PresetTemplate) => !!basicOf(p).textBgColorUsed
const barBg = (p: PresetTemplate) => basicOf(p).textBgColor || 'transparent'
// 文字条上的示意线条颜色，取文字模板颜色
const lineColor = (p: PresetTemplate) => p.data.text?.templates?.[0]?.color || '#ffffff'
</script>

<template>
	<div class="option-template px-3 pb-6">
		<div class="color6 text-xs mb-3 leading-5">
			点击卡片即可套用整体风格，套用后可在其他标签页继续微调。
		</div>
		<div class="grid grid-cols-2 gap-2.5">
			<div v-for="preset in presetTemplates" :key="preset.id"
				class="preset-card bg-color15 rounded-xl overflow-hidden border-1 border-solid border-color13 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
				@click="onApply(preset)">
				<!-- 效果缩略图 -->
				<div class="thumb aspect-[4/3] p-2 flex flex-col" :style="frameStyle(preset)">
					<div class="photo flex-1 bg-#c9ced6" :style="{ borderRadius: photoRadius(preset) }"></div>
					<div class="bar h-[24%] mt-1 rounded-sm flex-center gap-1"
						:style="{ background: hasBar(preset) ? barBg(preset) : 'transparent' }">
						<span class="inline-block w-5 h-[3px] rounded-full opacity-90"
							:style="{ background: lineColor(preset) }"></span>
						<span class="inline-block w-3 h-[3px] rounded-full opacity-70"
							:style="{ background: lineColor(preset) }"></span>
					</div>
				</div>
				<!-- 名称 + 描述 -->
				<div class="px-2 py-1.5">
					<div class="font-bold color3 text-xs leading-4 truncate">{{ preset.name }}</div>
					<div class="color6 text-[10px] leading-4 truncate">{{ preset.desc }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
