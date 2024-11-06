import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import ImageData from '@/hooks/imageData'

/**
 * 处理的文件列表
 */
export const useFileStore = defineStore('file', () => {
	const _imageData = ref<ImageData[]>([]) // 文件列表
	const _currentPreIndex = ref<number>(0) // 当前预览图索引

	const fileLength = computed<number>(() => _imageData.value.length)

	const addFiles = (files: File[]): string | null => {
		let isRepetition: string | null = null

		if (fileLength.value >= 20) {
			isRepetition = "文件数量超出限制[最大20张]，请删除后重新上传"
			return isRepetition
		}

		for (const file of files) {
			// 校验文件是否重复
			const index = _imageData.value.findIndex(item => item.filename === file.name && item.file?.size === file.size)
			if (fileLength.value >= 20) {
				isRepetition = "文件数量超出限制[最大20张]，请删除后重新上传"
				break;
			}

			if (index > -1) {
				isRepetition = "文件重复，请修改后重新上传"
				continue
			}

			// 正则校验文件是否是 "image/jpeg,image/png,image/jpg"
			const reg = new RegExp(`image\/(jpeg|png|jpg)`);
			if (!reg.test(file.type)) {
				isRepetition = "文件格式不正确，请上传jpeg/png/jpg图片文件"
				continue
			}

			// 异步处理文件读取和添加操作
			const imageData = new ImageData(file);
			_imageData.value.push(imageData);
		}

		return isRepetition
	}

	const removeFile = (key: string) => {
		const index = _imageData.value.findIndex(item => item.key === key)
		if (index > -1) {
			_imageData.value.splice(index, 1)
		}
	}

	const getFile = (key: string) => {
		return _imageData.value.find(item => item.key === key)
	}

	// 开启预览
	const startPreview = () => {
		// 开启预览
		_imageData.value[_currentPreIndex.value].startPreview()
	}

	// 重置清空
	const reset = () => {
		_imageData.value = []
		_currentPreIndex.value = 0
	}

	// 当前预览图索引
	const setCurrentPreIndex = (index: number) => {
		_currentPreIndex.value = index
	}

	// 顺序切图
	const onNext = (type: number) => {
		if (type === 0) {
			_currentPreIndex.value = _currentPreIndex.value === 0 ? 0 : _currentPreIndex.value - 1
		}
		if (type === 1) {
			_currentPreIndex.value = _currentPreIndex.value === _imageData.value.length - 1 ? _imageData.value.length - 1 : _currentPreIndex.value + 1
		}
	}

	return { _imageData, _currentPreIndex, fileLength, addFiles, removeFile, getFile, startPreview, reset, setCurrentPreIndex, onNext }
})