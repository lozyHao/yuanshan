import { ref } from 'vue'

import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'

import { Theme } from '@/interfaces/theme.ts'
import { ThemeEnum } from '@/interfaces/theme.ts'

/**
 * 主题
 */
export const useThemeStore = defineStore('theme', () => {
	const theme = ref<ThemeEnum | null>(null)
	const setTheme = () => {
		theme.value = theme.value === null ? darkTheme : null
		console.log(theme.value)
		setBodyClass()
	}

	const getThemeName = () => {
		if (theme.value) {
			return 'switch-theme-dark'
		}
		return 'switch-theme-light'
	}

	const isDark = () => theme.value !== null


	const setBodyClass = () => {
		// 将全局主题样式class类添加到body上
		if (theme.value) {
			document.body.classList.add('body-dark')
			document.body.classList.remove('body-light')
		} else {
			document.body.classList.remove('body-dark')
			document.body.classList.add('body-light')
		}
	}

	return { theme, setTheme, getThemeName, isDark, setBodyClass }
}, {
	persist: {
		key: "theme",
		storage: window?.localStorage,
	}
})