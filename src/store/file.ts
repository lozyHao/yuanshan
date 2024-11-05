import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import ImageData from '@/hooks/imageData'

/**
 * 处理的文件列表
 */
export const useFileStore = defineStore('file', () => {
	const _imageData = ref<ImageData[]>([]) // 文件列表
	const _currentPreIndex = ref<number>(0) // 当前预览图索引

	const _outLoading = ref<boolean>(false) // 输出加载中
	const _importLoading = ref<boolean>(false) // 导入文件加载中

	const fileLength = computed<number>(() => _imageData.value.length || 0)

	const addFiles = (files: File[]): string | null => {
		let isRepetition = null

		if (fileLength.value >= 20) {
			isRepetition = "文件数量超出限制[最大20张]，请删除后重新上传"
			return isRepetition
		}

		files.forEach(file => {
			// 校验文件是否重复
			const index = _imageData.value.findIndex(item => item.filename === file.name && item.file?.size === file.size)
			if (fileLength.value >= 20) {
				isRepetition = "文件数量超出限制[最大20张]，请删除后重新上传"
				return
			}

			if (index > -1) {
				isRepetition = "文件重复，请修改后重新上传"
				return
			}
			// 正则校验文件是否是 "image/jpeg,image/png,image/jpg"
			const reg = new RegExp(`image\/(jpeg|png|jpg)`);
			if (!reg.test(file.type)) {
				isRepetition = "文件格式不正确，请上传jpeg/png/jpg图片文件"
				return
			}
			_imageData.value.push(new ImageData(file))
		})

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

	// 预览图处理中
	const setOutLoading = (status: boolean) => {
		_outLoading.value = status
	}

	// 当前预览图索引
	const setCurrentPreIndex = (index: number) => {
		_currentPreIndex.value = index
	}

	// 顺序切图
	let timer: NodeJS.Timeout | null = null
	const onNext = (type: number) => {
		if (timer) {
			return
		}

		if (type === 0) {
			_currentPreIndex.value = _currentPreIndex.value === 0 ? 0 : _currentPreIndex.value - 1
		}
		if (type === 1) {
			_currentPreIndex.value = _currentPreIndex.value === _imageData.value.length - 1 ? _imageData.value.length - 1 : _currentPreIndex.value + 1
		}
		timer = setTimeout(() => {
			onNext(type)
			clearTimeout(timer as NodeJS.Timeout)
			timer = null
		}, 200)
	}

	return { _imageData, _outLoading, _importLoading, _currentPreIndex, fileLength, addFiles, removeFile, getFile, startPreview, reset, setOutLoading, setCurrentPreIndex, onNext }
})