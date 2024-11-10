
/** 获取图片的 imageBitmap*/
export async function getImageBitmap(url: string | File): Promise<{ image: ImageBitmap, width: number, height: number } | null> {
	if (!url) return null
	const img = new Image();
	if (typeof url === 'string') {
		img.src = url;
	} else {
		img.src = URL.createObjectURL(url);
	}

	return await new Promise<{ image: ImageBitmap, width: number, height: number } | null>((resolve) => {
		img.onload = async () => {
			const imageBitmap = await createImageBitmap(img);
			const { width, height } = imageBitmap
			resolve({ image: imageBitmap, width, height });
		};

		img.onerror = () => {
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