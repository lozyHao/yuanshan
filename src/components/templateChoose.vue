<script setup lang="ts">
import { computed } from "vue";
import { useOptionLensStore } from '@/store/optionLens.ts'


const emits = defineEmits(["update"])

const store = useOptionLensStore()

const tempOptions = computed(() => {
	let list = []
	store.getValue().forEach((item) => {
		list.push({
			label: item.name,
			key: item.description
		})
	})
	return list
})

const onChange = (value) => {
	emits("update", value)
}
</script>

<template>
	<div class="template-select flex-1">
		<n-dropdown class="default-layout h-60 overflow-auto" :options="tempOptions" trigger="hover" @select="onChange">
			<n-button type="primary">选择</n-button>
		</n-dropdown>
	</div>
</template>