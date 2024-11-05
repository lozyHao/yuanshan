<script setup lang="ts">
import { ref, watch } from "vue"

import { fontOptions } from '@/default/default-options.ts'

const props = defineProps({
	font: {
		type: String,
		default: null,
	}
})

const emits = defineEmits(["update:font"])

const selectedFont = ref(props.font)
watch(() => props.font, () => {
	selectedFont.value = props.font
	console.log(selectedFont.value)
})
</script>

<template>
	<div class="font-select flex-1">
		<n-select v-model:value="selectedFont" :options="fontOptions" @update:value="emits('update:font', $event)" />
	</div>
</template>