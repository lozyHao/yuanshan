<script setup lang="ts">
import { ref, watch, PropType, computed } from 'vue'

import { fontOptions } from '@renderer/default/font-options'

const props = defineProps({
	font: {
		type: String as PropType<string | null>,
		default: null
	},
	disabled: {
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['update:font'])

const selectedFont = ref(props.font)
const fontName = computed(() => {
	return fontOptions.find(item => item.value === selectedFont.value)?.label
})
watch(
	() => props.font,
	() => {
		selectedFont.value = props.font
	}
)
</script>

<template>
	<div class="font-select flex-1">
		<n-popover trigger="hover" :show-arrow="false" :disabled="props.disabled">
			<template #trigger>
				<div class="flex-start bg-color16 w-full pl-2 h-8 rounded-md cursor-pointer text-xl"
					:style="{ fontFamily: selectedFont || 'Arial' }">
					{{ fontName || '选择字体' }}
				</div>
			</template>
			<!-- 列表 -->
			<div class="default-layout w-45 h-50 overflow-y-auto px-1">
				<div class="menu-hover py-1 my-1 rounded-md text-center cursor-pointer text-xl"
					:style="{ fontFamily: item.value }" v-for="item in fontOptions" :key="item.value"
					@click="emits('update:font', item.value)">
					{{ item.label }}
				</div>
			</div>
		</n-popover>
	</div>
</template>
