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

const props = defineProps({
	rounded: {
		type: Number,
		default: 12
	},
	shadow: {
		type: Boolean,
		default: true
	}
})

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
	<div class="nav-bar h-12 bg-color16 transition-duration-300 flex justify-between items-center overflow-hidden"
		:class="props.shadow ? 'shadow-xl' : ''" :style="{
			borderRadius: props.rounded + 'px',
		}">
		<!-- 设置 -->
		<!-- <n-popover trigger="hover" :show-arrow="false">
      <template #trigger>
        <div
          class="flex-center menu-hover h-12 w-12 color3 cursor-pointer transition-all"
        >
          <n-icon :size="26">
            <Template />
          </n-icon>
        </div>
      </template>
<span>模板中心</span>
</n-popover> -->

		<div>
			<!-- 插槽 -->
			<slot name="action"></slot>
		</div>
	</div>
	<option-box v-model:show="showOptionBox"></option-box>
</template>

<style lang="less" scoped>
.nav-bar {
	backdrop-filter: blur(4px);
}
</style>
