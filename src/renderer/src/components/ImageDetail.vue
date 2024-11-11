<script setup lang="ts">
import html2canvas from 'html2canvas'

import { exifFields } from '@renderer/default/default-options'
import { ExifData } from '@renderer/hooks/exifFactory'
import { ArrowDownSharp } from '@vicons/ionicons5'
import { computed, PropType, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: null
  },
  exif: {
    type: Object as PropType<ExifData>,
    default: () => ({})
  }
})
const emits = defineEmits(['update:show'])

const localShow = computed(() => props.show)
const currentExif = ref<{ name: string; value: string }[]>([])

const onClose = () => {
  emits('update:show', false)
}

// 导出
const detailBox = ref<HTMLDivElement | null>(null)
const onDownLoadImage = () => {
  html2canvas(detailBox.value as HTMLDivElement).then((canvas: HTMLCanvasElement) => {
    canvas.toBlob((blob) => {
      const url = window.URL.createObjectURL(blob as Blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'image.png'
      a.click()
    })
  })
}

watch(
  () => props.show,
  (newVal: boolean) => {
    if (newVal) {
      currentExif.value = getExifJSON(props.exif)
    }
  }
)

const getExifJSON = (exif: ExifData): { name: string; value: string }[] => {
  const list: { name: string; value: string }[] = []
  for (const key in exif) {
    const e = exifFields.find((item) => item.key === key)
    console.log(e)
    if (e) {
      list.push({
        name: e.name as string,
        value: exif[key] as string
      })
    }
  }
  return list
}
</script>

<template>
  <n-modal
    v-model:show="localShow"
    title="详情参数"
    preset="card"
    size="huge"
    :mask-closable="false"
    :style="{ width: '1000px', height: '560px', paddingBottom: '20px', position: 'relative' }"
    :content-style="{ height: '100%', overflow: 'auto' }"
    @update:show="onClose"
  >
    <div ref="detailBox" class="w-80% mx-auto py-4">
      <img class="block w-80% mx-auto mb-4 rounded-xl" :src="props.image" />
      <div class="w-80% mx-auto grid grid-cols-2 gap-y-2 gap-x-1">
        <div v-for="item in currentExif" :key="item?.name" class="flex-start">
          <div class="w-18 flex-end">
            <n-tag :bordered="false" type="info">
              {{ item.name }}
            </n-tag>
          </div>
          <span class="pl-2">{{ item.value || '-' }}</span>
        </div>
      </div>
    </div>
    <n-popover trigger="hover" :show-arrow="false">
      <template #trigger>
        <n-button
          class="absolute bottom-10 right-10"
          strong
          secondary
          circle
          type="info"
          @click="onDownLoadImage"
        >
          <template #icon>
            <n-icon :component="ArrowDownSharp" />
          </template>
        </n-button>
      </template>
      截图导出图片报告
    </n-popover>
  </n-modal>
</template>
