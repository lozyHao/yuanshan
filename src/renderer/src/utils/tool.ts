
/** 获取图片的 imageBitmap*/
export async function getImageBitmap(url: string | File): Promise<{ image: ImageBitmap, width: number, height: number } | null> {
	if (!url) return null
	const img = new Image();
	// 由 File 创建的 objectURL 需在用完后释放
	const objectUrl = typeof url === 'string' ? null : URL.createObjectURL(url);
	img.src = objectUrl ?? (url as string);

	return await new Promise<{ image: ImageBitmap, width: number, height: number } | null>((resolve) => {
		img.onload = async () => {
			const imageBitmap = await createImageBitmap(img);
			const { width, height } = imageBitmap
			if (objectUrl) URL.revokeObjectURL(objectUrl);
			resolve({ image: imageBitmap, width, height });
		};

		img.onerror = () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
			resolve(null);
		}
	})
}


/** 字体加载 */
export async function loadFont(fonts: { value: string, key: string }[]) {
	const fontPromises = fonts.map(font => {
		const myFont = new FontFace(`${font.value}`, `url(${font.key})`);
		return new Promise((resolve, reject) => {
			myFont.load().then(fontFace => {
				document.fonts.add(fontFace);
				resolve(true);
			}).catch(error => {
				reject({ key: font.key, error });
			});
		});
	});

	try {
		await Promise.all(fontPromises);
		return true;
	} catch (error) {
		console.error('字体加载失败', error);
		return false;
	}
}