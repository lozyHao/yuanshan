// main.js
import { defineStore } from 'pinia'

import { useThemeStore } from './theme'

export const useStore = defineStore('store', () => {
  return {
    useThemeStore: useThemeStore()
  }
})
