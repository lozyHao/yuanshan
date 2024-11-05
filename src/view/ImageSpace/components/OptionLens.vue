<script setup lang="ts">
import { EditSettings24Regular, Add24Filled } from "@vicons/fluent";

import { ref, computed } from "vue";
import { useMessage } from "naive-ui";

import { useOptionLensStore } from "@/store/optionLens.ts";
import { OptionLensValues, OptionLensEnum } from "@/interfaces/options.ts";

import PopLensEdit from "@/components/PopLensEdit.vue";

const store = useOptionLensStore();

const message = useMessage();

const myData = computed(() => store._data.filter((item: OptionLensValues) => item.type === 1));
const systemData = computed(() => store._data.filter((item: OptionLensValues) => item.type === 0));

const lensEditPopShow = ref(false);
const currentItem = ref<OptionLensValues | null>(null);
const onClickEdit = (item: OptionLensValues | null) => {
	currentItem.value = item;
	lensEditPopShow.value = true;
};

const onSubmit = (item: OptionLensValues) => {
	if (item.key) {
		store.edit(item);
		message.success("修改成功");
	} else {
		store.add(item);
		message.success("添加成功");
	}
}

const onDelete = (item: OptionLensValues) => {
	store.del(item.key);
}

const handleChange = (key: OptionLensEnum, value: string) => {
	store.edit(key, value);
};
</script>
<template>
	<div class="option-lens pl-3 pb-10">
		<n-grid x-gap="12" y-gap="8" :cols="1">
			<n-gi class="color9 flex-between text-base font-bold mb-2">
				<span>自定义参数</span>
				<n-button strong secondary circle type="info" size="small" @click="onClickEdit">
					<template #icon>
						<n-icon :component="Add24Filled" />
					</template>
				</n-button>
			</n-gi>
			<n-gi class="flex-between bg-color15 rounded-lg p-1" v-for="item in myData" :key="item.key">
				<n-switch size="small" v-model:value="item.used" @update:value="handleChange(item, $event)" />
				<div class="px-2 flex-1">{{ item.name }}</div>
				<n-button strong secondary circle type="info" size="tiny" @click="onClickEdit(item)">
					<template #icon>
						<n-icon :component="EditSettings24Regular" />
					</template>
				</n-button>
			</n-gi>
			<n-gi class="mt-5 mb-3">
				<n-divider />
			</n-gi>
			<n-gi class="color9 flex-between text-base font-bold mb-2">
				相机参数
			</n-gi>
			<n-gi class="flex-between bg-color15 rounded-lg p-1" v-for="item in systemData" :key="item.key">
				<n-switch size="small" v-model:value="item.used" @update:value="handleChange(item, $event)" />
				<div class="px-2 flex-1">{{ item.name }}</div>
				<n-button strong secondary circle type="info" size="tiny" @click="onClickEdit(item)">
					<template #icon>
						<n-icon :component="EditSettings24Regular" />
					</template>
				</n-button>
			</n-gi>
		</n-grid>
	</div>
	<pop-lens-edit v-model:show="lensEditPopShow" :pre="currentItem" @on-submit="onSubmit"
		@on-delete="onDelete"></pop-lens-edit>
</template>
