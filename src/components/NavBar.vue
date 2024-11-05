<script setup lang="ts">
import { Pencil } from "@vicons/tabler";
import {
	WeatherSunnyLow20Regular,
	WeatherMoon24Regular,
	Settings24Filled,
	QuestionCircle24Regular,
	Star24Regular,
	Home16Filled,
} from "@vicons/fluent";
import { OptionsOutline } from "@vicons/ionicons5";

import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import router from "../router";

import { useThemeStore } from "@/store/theme.ts";

import OptionBox from "./OptionDefault.vue";

const route = useRoute();
const routerName = computed(() => route.name === "home");

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

// 路由
const navigationTo = (name?: string | null) => {
	if (!name) {
		router.go(-1);
	}
	router.push({
		name: name || "home",
	});
};
</script>

<template>
	<div class="nav-bar h-12 bg-color16 transition-duration-300 flex justify-between items-center overflow-hidden"
		:class="props.shadow ? 'shadow-xl' : ''" :style="{
			borderRadius: props.rounded + 'px',
		}">
		<!-- 路由 -->
		<n-popover trigger="hover" :show-arrow="false" v-if="!routerName">
			<template #trigger>
				<div class="flex-center bg-#2080f0 h-12 w-12 color-#fff cursor-pointer" @click="navigationTo()">
					<n-icon :size="26">
						<Home16Filled />
					</n-icon>
				</div>
			</template>
			<span>首页</span>
		</n-popover>
		<n-popover trigger="hover" :show-arrow="false">
			<template #trigger>
				<div class="flex-center menu-hover h-12 w-12 color3 cursor-pointer transition-all"
					@click="navigationTo('imageSpace')">
					<n-icon :size="26">
						<Pencil />
					</n-icon>
				</div>
			</template>
			<span>即刻创作: 调节参数、实时预览</span>
		</n-popover>
		<div class="bg-color12 h-5 w-[1px]"></div>
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
		<n-popover trigger="hover" :show-arrow="false">
			<template #trigger>
				<div class="flex-center menu-hover h-12 w-12 color3 cursor-pointer transition-all"
					@click="showOptionBox = true">
					<n-icon :size="26">
						<OptionsOutline />
					</n-icon>
				</div>
			</template>
			<span>通用配置</span>
		</n-popover>
		<n-popover trigger="hover" :show-arrow="false">
			<template #trigger>
				<div class="flex-center menu-hover w-12 h-12 cursor-pointer transition-all">
					<n-icon class="color3 transition-all hover:transform-rotate-180" size="24">
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
