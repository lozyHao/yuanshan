<script setup lang="ts">
import { CloudUpload } from '@vicons/ionicons5'
import { IconSize } from '@/interfaces/options.ts'
import { PropType } from 'vue'


const props = defineProps({
	iconSize: {
		type: String as PropType<IconSize>,
		default: 'medium'
	},
	type: {
		type: String,
		default: 'image/jpeg,image/png,image/jpg',
	},
	maxSize: {
		type: Number,
		default: 100
	},
	multiple: {
		type: Boolean,
		default: false
	},
	fileType: {
		type: String,
		default: 'file' // file directory
	},
	disabled: {
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['onChange'])

// 点击选择文件
const openFile = async () => {
	if (props.fileType === 'file') {
		const filePath = await window.electronAPI.openFile()
		emits('onChange', filePath[0])
		return
	}

	if (props.fileType === 'directory') {
		const filePath = await window.electronAPI.openFileDirectory()
		emits('onChange', filePath[0])
		return
	}
}
</script>

<template>
	<div class="upload-file">
		<n-popover :disabled="props.disabled">
			<template #trigger>
				<n-button strong secondary circle type="info" :size="props.iconSize" :disabled="props.disabled"
					@click="openFile">
					<template #icon>
						<n-icon :component="CloudUpload" />
					</template>
				</n-button>
			</template>
			<span>点击上传水印图片</span>
		</n-popover>
	</div>
</template>