// main.js
import { defineStore } from 'pinia'

import { useThemeStore } from './theme.ts'

export const useStore = defineStore('store', () => {

	return {
		useThemeStore: useThemeStore()
	}
})