<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'

import { computed } from 'vue'

import { useThemeStore } from './store/theme'

import ImageSpace from '@renderer/view/ImageSpace.vue'
import TitleBar from '@renderer/components/TitleBar.vue'

const store = useThemeStore()

const theme = computed(() => {
  store.setBodyClass()
  return store.theme
})

const lightThemeOverrides = {
  common: {
    primaryColor: '#2080f0',
    infoColor: '#2080f0'
  }
}

const darkThemeOverrides = {
  common: {
    primaryColor: '#4098fc',
    infoColor: '#4098fc'
  }
}
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="theme"
    :theme-overrides="theme === null ? lightThemeOverrides : darkThemeOverrides"
  >
    <n-modal-provider>
      <n-dialog-provider>
        <n-message-provider>
          <div id="app-content" class="bg-color15">
            <div
              class="drag-box border-color16 border-b-1 border-b-solid w-full h-10 bg-color14 pl-4 pr-36"
            >
              <title-bar></title-bar>
            </div>
            <div class="content-box">
              <image-space></image-space>
            </div>
          </div>
        </n-message-provider>
      </n-dialog-provider>
    </n-modal-provider>
  </n-config-provider>
</template>

<style lang="less" scoped>
.content-box {
  width: 100%;
  height: calc(100% - 40px);
}
</style>
