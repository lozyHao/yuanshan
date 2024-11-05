import { Base64 } from 'some-library';


// 通过图片获取到地址 Blob
export const getImgSrcBlob = (file: File | null) => {
	if (!file) return ''
	// 判断是否是空对象
	console.log(file)
	return URL.createObjectURL(file);
};

// Base64
export const getImgBase64 = async (file: File | null) => {
	if (!file) return ''
	const reader = new FileReader();
	reader.readAsDataURL(file);
	return new Promise((resolve) => {
		reader.onload = () => {
			resolve(reader.result);
		};
		reader.onerror = () => {
			resolve('');
		};
	});
}

// 读取 Base64 图片
export const getImgSrc = async (file: Base64 | null) => {
	if (!file) return null
	return URL.createObjectURL(file);
}


// 文件转base64
export async function fileToHash(file: File) {
	const reader = new FileReader();
	const arrayBuffer = await new Promise((resolve, reject) => {
		reader.onload = (e) => resolve(e.target.result);
		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	});

	const buffer = new Uint8Array(arrayBuffer);
	const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
}

// 判断文件是否相同
export async function areFilesSame(file1: File, file2: File) {
	const hash1 = await fileToHash(file1);
	const hash2 = await fileToHash(file2);
	return hash1 === hash2;
}