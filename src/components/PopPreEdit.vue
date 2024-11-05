<script setup lang="ts">
import { Delete24Regular } from "@vicons/fluent";

import { computed, ref } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  pre: {
    type: Object,
    default: null,
  },
});
const emits = defineEmits(["update:show"]);

const show = computed(() => props.show);
const isAdd = ref(true);

const formValue = ref({
  id: "",
  name: "",
  order: 1,
});

const onClose = () => {
  emits("update:show", false);
};
</script>

<template>
  <n-modal
    v-model:show="show"
    :title="isAdd ? '添加配置' : '编辑配置'"
    preset="card"
    size="huge"
    :mask-closable="false"
    :style="{ width: '400px' }"
    @update:show="onClose"
  >
    <div class="pre-edit-pop">
      <n-grid x-gap="12" y-gap="16" :cols="4">
        <n-gi class="flex-end" :span="1">预设名称</n-gi>
        <n-gi :span="3">
          <n-input></n-input>
        </n-gi>
        <n-gi class="flex-end" :span="1">排序</n-gi>
        <n-gi :span="3">
          <n-input-number></n-input-number>
        </n-gi>
        <n-gi :span="2">
          <n-button type="error" strong secondary>
            <template #icon>
              <n-icon :component="Delete24Regular" />
            </template>
          </n-button>
        </n-gi>
        <n-gi class="flex-end" :span="2">
          <n-button type="warning">取消</n-button>
          <n-button class="ml-4" type="info">保存</n-button>
        </n-gi>
      </n-grid>
    </div>
  </n-modal>
</template>
