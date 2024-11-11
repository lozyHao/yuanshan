<script setup lang="ts">
import { CameraAdd24Regular } from '@vicons/fluent'

import { cameraBrandOptions } from '@renderer/default/default-options'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['onChoose'])

const onChoose = (value: string) => {
  console.log(value)
  emits('onChoose', value)
}
</script>

<template>
  <div class="camera-select">
    <n-popover
      class="default-layout h-60 w-40 overflow-y-auto"
      style="padding: 12px 0"
      trigger="hover"
      :disabled="props.disabled"
    >
      <template #trigger>
        <n-button type="info" size="tiny" circle strong secondary :disabled="props.disabled">
          <template #icon>
            <n-icon :component="CameraAdd24Regular" />
          </template>
        </n-button>
      </template>
      <div class="w-full">
        <div
          v-for="item in cameraBrandOptions"
          :key="item.value"
          class="bg-color15 w-full h-10 px-2 py-3 object-contain cursor-pointer"
          @click="onChoose(item.value)"
        >
          <img class="w-full h-full object-contain" :src="item.value" alt="" />
        </div>
      </div>
    </n-popover>
  </div>
</template>
