<script setup lang="ts">
import { Eye24Filled } from '@vicons/fluent'
import { useMessage } from 'naive-ui';
import { PropType } from 'vue';

const props = defineProps({
	dir: {
		type: String as PropType<string | null>,
		default: 'medium'
	},
	iconSize: {
		type: String,
		default: 'small'
	}
})

const message = useMessage()

// 点击选择文件
const openFile = async () => {
	if (!props.dir) {
		message.warning("请选择文件夹");
		return
	}
	await (window.api as any).openFileDirectoryByPath(props.dir)
}
</script>

<template>
	<div class="open-dir">
		<n-button strong secondary circle type="info" :size="props.iconSize">
			<template #icon>
				<n-icon :component="Eye24Filled" @click="openFile" />
			</template>
		</n-button>
	</div>
</template>
