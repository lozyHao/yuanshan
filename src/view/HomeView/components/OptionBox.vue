<script setup lang="ts">
import OptionBasic from '@/components/OptionBasic.vue';
import OptionLens from '@/components/OptionLens.vue';
import OptionText from '@/components/OptionText.vue';

import { computed } from 'vue';

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
})
const emits = defineEmits(['update:show'])

const show = computed(() => props.show)
const onClose = () => {
	emits('update:show', false)
}
</script>

<template>
	<n-drawer v-model:show="show" placement="bottom" height="auto" @update:show="onClose">
		<div id="default-layout" class="option-box bg-color15 w-full h-80vh max-h-120 overflow-auto">
			<div class="theme-change-btn w-full h-6 flex justify-center absolute top-3">
				<div class="close-btn bg-color9 w-40 h-[6px] hover:h-[10px] rounded-[5px] transition-all cursor-pointer"
					@click="onClose">
				</div>
			</div>
			<div class="content w-full max-w-270 mx-auto overflow-hidden pt-10 p-5">
				<n-tabs type="line" justify-content="center" size="large" animated>
					<n-tab-pane name="chap1" tab="基础配置">
						<option-basic></option-basic>
					</n-tab-pane>
					<n-tab-pane name="chap2" tab="参数设置">
						<option-lens></option-lens>
					</n-tab-pane>
					<n-tab-pane name="chap3" tab="文字模板">
						<option-text></option-text>
					</n-tab-pane>
				</n-tabs>
			</div>
		</div>
	</n-drawer>
</template>

<style lang="less" scoped></style>