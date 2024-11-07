import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import ImageData from '@/hooks/imageData'
import WorkerManager from "@/hooks/WorkerManager";

/**
 * 处理的文件列表
 */
export const useFileStore = defineStore('file', () => {
	const _imageData = ref<ImageData[]>([]) // 文件列表
	const _currentPreIndex = ref<number>(0) // 当前预览图索引

	const _loading = ref<boolean>(false)

	const fileLength = computed<number>(() => _imageData.value.length)

	const addFiles = async (files: File[]): Promise<string> => {
		_loading.value = true
		return await new Promise((resolve) => {
			const worker = new WorkerManager();
			worker.createWorker("addFiles", new URL("../hooks/worker.ts", import.meta.url).href);
			worker.postMessage("addFiles", { data: files, currentFiles: [..._imageData.value.map(item => item.file)] }, (message: { str: string, files: File[] }) => {
				console.log("接收到的数据", message);
				const { files, str } = message
				if (files && files.length > 0) {
					message.files.forEach((file: File) => {
						_imageData.value.push(new ImageData(file))
					})
				}
				_loading.value = false
				resolve(str);
			});
		})
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

	return { _imageData, _currentPreIndex, _loading, fileLength, addFiles, removeFile, getFile, startPreview, reset, setCurrentPreIndex, onNext }
})