import { ref } from 'vue'

import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'

import { Theme } from '@/interfaces/theme.ts'
import { ThemeEnum } from '@/interfaces/theme.ts'

/**
 * 主题
 */
export const useThemeStore = defineStore('theme', () => {
	const theme = ref(null)
	const setTheme = (t: ThemeEnum = ThemeEnum.light) => {
		return theme.value === t === ThemeEnum.light ? null : darkTheme
	}

	return { theme, setTheme }
})