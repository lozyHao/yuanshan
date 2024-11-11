<script setup lang="ts">
import { ref, watch, PropType } from 'vue'

import { fontOptions } from '@renderer/default/default-options'

const props = defineProps({
  font: {
    type: String as PropType<string | null>,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:font'])

const selectedFont = ref(props.font)
watch(
  () => props.font,
  () => {
    selectedFont.value = props.font
  }
)
</script>

<template>
  <div class="font-select flex-1">
    <n-select
      v-model:value="selectedFont"
      :options="fontOptions"
      :disabled="props.disabled"
      @update:value="emits('update:font', $event)"
    />
  </div>
</template>
