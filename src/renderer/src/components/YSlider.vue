<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
	value: number;
	step?: number; // 增减步进
	min?: number; // 最小值
	max?: number; // 最大值
}>();

const emits = defineEmits(['update:value', "onChange"]);

const currentValue = ref(props.value || 0)

const onChange = (value: number) => {
	console.log(value)
	currentValue.value = value
	emits('update:value', value)
	emits('onChange', value)
}


watch(() => props.value, (value) => {
	currentValue.value = value
})
</script>

<template>
	<div class="input-container h-[22px] bg-color15 flex items-center">
		<slot></slot>
		<n-slider class="flex-1 px-2" v-model:value="currentValue" :step="step" :min="min" :max="max"
			@update:value="onChange" />
		<span class="w-8">{{ value }}</span>
	</div>
</template>

<style scoped lang="less">
.input-container {
	display: flex;
	align-items: center;
	border-radius: 4px;
	padding: 2px 4px;
	margin-right: 4px;
}

.slot-container {
	width: 22px;
	height: 22px;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>