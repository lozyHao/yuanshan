<script setup lang="ts">
import { CloudUpload } from '@vicons/ionicons5'
import { IconSize } from '@renderer/interfaces/options'
import { PropType } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()

const props = defineProps({
	iconSize: {
		type: String as PropType<IconSize>,
		default: 'medium'
	},
	type: {
		type: String,
		default: 'image/jpeg,image/png,image/jpg'
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
	},
	msg: {
		type: String,
		default: '上传图片'
	}
})

const emits = defineEmits(['onChange'])

// 点击选择文件
const openFile = async () => {
	if (props.fileType === 'file') {
		const result = await (window.api as any).openFile()
		const { msg, status, fileDir } = result
		console.log(result)
		if (!status) {
			message.error(msg)
			return
		}
		emits('onChange', fileDir[0])
		return
	}

	if (props.fileType === 'directory') {
		const filePath = await (window.api as any).openFileDirectory()
		if (!filePath) return
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
			<span>{{ props.msg }}</span>
		</n-popover>
	</div>
</template>
