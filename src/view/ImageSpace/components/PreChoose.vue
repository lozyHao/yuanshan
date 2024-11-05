<script setup lang="ts">
import { CaretDown24Filled, EditSettings24Regular } from "@vicons/fluent";
import { CloseFilled } from "@vicons/material";
import { DragIndicatorOutlined } from "@vicons/material";

import { ref } from "vue";

import { VueDraggable } from "vue-draggable-plus";

import PopPreEdit from "@/components/PopPreEdit.vue";

const options = ref([
  {
    id: 1,
    name: "模板1",
  },
  {
    id: 2,
    name: "模板2",
  },
  {
    id: 3,
    name: "模板3",
  },
]);

const onUpdated = () => {
  console.log("改变结束", options.value);
};

// 添加/编辑弹窗
const preEditPopShow = ref(false);
const onclickEdit = () => {
  preEditPopShow.value = true;
};
</script>
<template>
  <div class="pre-choose w-full h-full rounded-xl overflow-hidden">
    <div class="flex-center bg-color15 w-full h-8">
      <n-button strong secondary @click="onclickEdit"> 添加到预设 </n-button>
      <n-popover trigger="click" :show-arrow="false">
        <template #trigger>
          <n-button type="info">
            <template #icon>
              <n-icon color="#fff" :size="24" :component="CaretDown24Filled" />
            </template>
          </n-button>
        </template>
        <div class="w-60 h-auto">
          <VueDraggable
            class="w-full cursor-pointer"
            v-model="options"
            :animation="150"
            @end="onUpdated"
          >
            <div
              class="menu-hover flex-between p-1 rounded-md transition-colors cursor-pointer"
              v-for="item in options"
              :key="item.id"
            >
              <n-icon :component="DragIndicatorOutlined" />
              <span class="color3 flex-1 px-2">{{ item.name }}</span>
              <n-button strong secondary circle type="info" size="tiny">
                <template #icon>
                  <n-icon size="14" :component="EditSettings24Regular" />
                </template>
              </n-button>
              <n-button
                class="ml-2"
                strong
                secondary
                circle
                type="warning"
                size="tiny"
              >
                <template #icon>
                  <n-icon size="16" :component="CloseFilled" />
                </template>
              </n-button>
            </div>
          </VueDraggable>
        </div>
      </n-popover>
    </div>
  </div>
  <pop-pre-edit v-model:show="preEditPopShow"></pop-pre-edit>
</template>
