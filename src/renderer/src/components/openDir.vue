<script setup lang="ts">
import { Eye24Filled } from '@vicons/fluent'

const props = defineProps({
  dir: {
    type: String,
    default: 'medium'
  },
  iconSize: {
    type: String,
    default: 'small'
  }
})

// 点击选择文件
const openFile = async () => {
  await (window.api as any).openFileDirectoryByPath(props.dir)
}
</script>

<template>
  <div class="open-dir">
    <n-button strong secondary circle type="info" :size="props.iconSize">
      <template #icon>
        <n-icon :component="Eye24Filled" @click="openFile" />
      </template>
    </n-button>
  </div>
</template>
