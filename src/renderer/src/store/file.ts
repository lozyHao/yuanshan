import { ref, computed } from "vue";
import { defineStore } from "pinia";

import ImageData from "@renderer/hooks/imageData";
import WorkerManager from "@renderer/hooks/WorkerManager";
import { getParams } from "@renderer/hooks/paramsUtils";
import TaskQueue from "@renderer/hooks/taskQueue";

import {
	OptionBasicValues,
	OptionTextTemplateValues,
	OptionLensValues,
} from "@renderer/interfaces/options";

import FileWorker from "@renderer/hooks/fileWorker.ts?worker";

/**
 * 处理的文件列表
 */
export const useFileStore = defineStore("file", () => {
	const _imageData = ref<ImageData[]>([]); // 文件列表
	const _currentPreIndex = ref<number>(0); // 当前预览图索引

	const _loading = ref<boolean>(false);
	const _outputLoading = ref<boolean>(false); // 开始输出

	const fileLength = computed<number>(() => _imageData.value.length);

	// 任务队列
	const taskQueue = ref<TaskQueue | null>(null)

	const addFiles = async (files: File[]): Promise<string> => {
		_loading.value = true;
		return await new Promise((resolve) => {
			const currentFiles = [
				...(_imageData.value?.map((item) => item.file) || []),
			];

			const worker = new WorkerManager();
			worker.createWorker("addFiles", FileWorker);
			worker.postMessage(
				"addFiles",
				{ data: files, currentFiles: currentFiles },
				(message: { str: string; files: File[] }) => {
					const { files, str } = message;
					console.log("上传的文件", message);
					if (files && files.length > 0) {
						message.files.forEach((file: File) => {
							_imageData.value.push(new ImageData(file));
						});
					}
					setTimeout(() => {
						_loading.value = false;
						resolve(str);
					}, 1000);
				},
			);
		});
	};

	const removeFile = (key: string) => {
		const index = _imageData.value.findIndex((item) => item.key === key);
		if (index > -1) {
			_imageData.value.splice(index, 1);
		}
		if (index <= _currentPreIndex.value) {
			_currentPreIndex.value--;
		}
	};

	const getFile = (key: string) => {
		return _imageData.value.find((item) => item.key === key);
	};

	// 开启预览
	const startPreview = async (options: {
		basic: OptionBasicValues;
		text: OptionTextTemplateValues[];
		lens: OptionLensValues[];
	}) => {
		const { basic, text, lens } = options;
		const data = await getParams({
			exif: _imageData.value[_currentPreIndex.value].exif,
			basic,
			text,
			lens,
		});
		// 开启预览
		_imageData.value[_currentPreIndex.value].onPrint(data);
	};

	// 开始输出
	const startOutput = async (options: {
		basic: OptionBasicValues;
		text: OptionTextTemplateValues[];
		lens: OptionLensValues[];
	}) => {
		const { basic, text, lens } = options;

		if (fileLength.value === 0) return;

		const data = await getParams({
			exif: _imageData.value[_currentPreIndex.value].exif,
			basic,
			text,
			lens,
		});
		//    通过并发量控制
		_outputLoading.value = true
		taskQueue.value = new TaskQueue(3, (_total, _completed, _uncompleted, allCompleted) => {
			if (allCompleted) {
				_outputLoading.value = false
			}
		});

		// 添加任务
		for (let i = 1; i <= fileLength.value; i++) {
			taskQueue.value.addTask(
				async () => await _imageData.value[i - 1].onPrint(data, "output"),
			);
		}

		// 启动任务队列
		taskQueue.value.start();
	};

	// 重置清空
	const reset = () => {
		_imageData.value = [];
		_currentPreIndex.value = 0;
	};

	// 文件列表恢复默认
	const restoreDefault = () => {
		_imageData.value.forEach((item) => item.restoreDefault());
	}

	// 当前预览图索引
	const setCurrentPreIndex = (index: number) => {
		_currentPreIndex.value = index;
	};

	return {
		_imageData,
		_currentPreIndex,
		_loading,
		_outputLoading,
		fileLength,
		addFiles,
		removeFile,
		getFile,
		startPreview,
		startOutput,
		reset,
		setCurrentPreIndex,
		restoreDefault,
	};
});
