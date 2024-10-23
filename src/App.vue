<script setup lang="ts">
  import { zhCN, dateZhCN } from 'naive-ui'
  
import { computed } from 'vue'

import { useThemeStore } from './store/theme';

const store = useThemeStore();

const theme = computed(() => {
	store.setBodyClass()
	return store.theme
})

const lightThemeOverrides = {
	common: {
		primaryColor: '#2080f0',
	},
}

const darkThemeOverrides = {
	common: {
		primaryColor: '#4098fc'
	}
}

</script>

<template>
	<n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="theme"
		:theme-overrides="theme === null ? lightThemeOverrides : darkThemeOverrides">
		<div id="app-content" class="bg-color15">
			<router-view></router-view>
		</div>
	</n-config-provider>
</template>