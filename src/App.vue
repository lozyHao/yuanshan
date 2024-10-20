<script setup lang="ts">
import { computed } from 'vue'

import { useThemeStore } from './store/theme';

const store = useThemeStore();
const themeStore = store.theme

const theme = computed(() => {
	store.setBodyClass()
	return themeStore
})
</script>

<template>
	<n-config-provider :theme="theme">
		<div id="app-content" class="bg-color15">
			<router-view></router-view>
		</div>
	</n-config-provider>
</template>