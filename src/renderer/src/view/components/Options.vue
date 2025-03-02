<script setup lang="ts">
import OptionBasic from "./OptionBasic.vue";
import OptionText from "./OptionText.vue";
import OptionLens from "./OptionLens.vue";
</script>

<template>
	<div class="option w-full h-full">
		<n-tabs default-value="oasis" justify-content="space-evenly" type="line">
			<n-tab-pane name="oasis" tab="配置">
				<option-basic></option-basic>
			</n-tab-pane>
			<n-tab-pane name="jay chou" tab="文字模板">
				<option-text></option-text>
			</n-tab-pane>
			<n-tab-pane name="the beatles" tab="相机参数">
				<option-lens></option-lens>
			</n-tab-pane>
		</n-tabs>
	</div>
</template>

<style lang="less" scoped></style>
