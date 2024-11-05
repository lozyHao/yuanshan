<script setup lang="ts">

import { computed } from "vue";
import { useOptionDefaultStore } from "@/store/optionDefault";
import { OptionDefaultEnum } from "@/interfaces/options";

import UploadFile from "@/components/UploadFile.vue";
import OpenDir from "@/components/openDir.vue";

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
});
const emits = defineEmits(["update:show"]);

const store = useOptionDefaultStore();

const formValue = computed(() => {
	return { ...store.getValue() };
});

const show = computed(() => props.show);
const onClose = () => {
	emits("update:show", false);
};


const handleChange = async (key: OptionDefaultEnum, value: string) => {
	if (key === 'outputPath') {
		console.log("设置");
		if (value) {
			store.set(key, value[0]);
		}
	} else {
		store.set(key, value);
	}
};
</script>

<template>
	<n-modal v-model:show="show" title="通用配置" preset="card" size="huge" :mask-closable="false"
		:style="{ width: '600px' }" @update:show="onClose">
		<div id="default-layout" class="option-box w-full h-full max-h-120 overflow-auto">
			<n-grid x-gap="12" y-gap="24" :cols="12">
				<n-gi :span="2" class="flex-end">输出目录</n-gi>
				<n-gi :span="8">
					<n-input v-model:value="formValue.outputPath" placeholder="输出目录" disabled></n-input>
				</n-gi>
				<n-gi :span="2" class="flex-start">
					<n-space size="small">
						<open-dir :iconSize="'small'" :dir="formValue.outputPath">
						</open-dir>
						<upload-file :iconSize="'small'" :file-type="'directory'"
							@on-change="handleChange('outputPath', $event)">
						</upload-file>
					</n-space>
				</n-gi>
			</n-grid>
		</div>
	</n-modal>
</template>

<style lang="less" scoped></style>
