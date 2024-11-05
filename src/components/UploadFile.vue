<script setup lang="ts">
import { CloudUpload } from '@vicons/ionicons5'

import { PropType } from 'vue'

enum IconSize {
	Mini = 'tiny',
	Small = 'small',
	Medium = 'medium',
	Large = 'large'
}

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
	}
})

const emits = defineEmits(['onChange'])

// 点击选择文件
const openFile = async () => {
	if (props.fileType === 'file') {
		const filePath = await window.electronAPI.openFile()
		emits('onChange', filePath)
		return
	}

	if (props.fileType === 'directory') {
		const filePath = await window.electronAPI.openFileDirectory()
		emits('onChange', filePath)
		return
	}
}
</script>

<template>
	<div class="upload-file">
		<n-button strong secondary circle type="info" :size="props.iconSize">
			<template #icon>
				<n-icon :component="CloudUpload" @click="openFile" />
			</template>
		</n-button>
	</div>
</template>