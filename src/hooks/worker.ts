// worker.ts
self.onmessage = (event) => {
	const { data, currentFiles, callbackId } = event.data;
	console.log(data, currentFiles)
	const result = processFiles(data, currentFiles);
	postMessage({ result, callbackId });
};


const processFiles = (list: File[], files: File[]) => {
	let str = '加载完成';
	const arrList = [];

	if (arrList.length >= 20) {
		str = "文件数量超出限制[最大20张]，请删除后重新上传"
		return str
	}

	for (const file of list) {
		// 校验文件是否重复
		const index = files.findIndex(item => item.name === file.name && item.size === file.size)
		if (arrList.length + files.length >= 20) {
			str = "文件数量超出限制[最大20张]，请删除后重新上传"
			break;
		}

		if (index > -1) {
			str = "文件重复，请修改后重新上传"
			continue
		}

		// 正则校验文件是否是 "image/jpeg,image/png,image/jpg"
		const reg = new RegExp(`image\/(jpeg|png|jpg)`);
		if (!reg.test(file.type)) {
			str = "文件格式不正确，请上传jpeg/png/jpg图片文件"
			continue
		}

		if (file.size > 30 * 1024 * 1024) {
			str = "文件大小不能超过 30MB";
			continue;
		}

		arrList.push(file)
	}

	return {
		files: arrList,
		str
	};
};