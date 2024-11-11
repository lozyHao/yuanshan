<script setup lang="ts">
const props = defineProps({
	label: {
		type: String,
		default: ''
	}
})
</script>

<template>
	<span class="must-text flex-between relative">
		{{ props.label }}
		<div class="color-error text-xl absolute top--2 right--2">*</div>
	</span>
</template>