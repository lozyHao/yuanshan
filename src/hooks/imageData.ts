import { getUUID } from "@/utils/uuid";

import ExifFactory from "./exifFactory";
import WorkerManager from "@/hooks/WorkerManager";
import { ImageTextItem, OptionBasicValues, TextTemplatePositionEnum } from "@/interfaces/options";

class ImageData {
	key: string;
	file: File | null;
	filename: string;
	perUrl: string; // 原图预览地址
	outerUrl: string | null; // 输出预览地址
	exif: ExifFactory; // 元数据对象

	preLoading: boolean = false; // 预览图更新中
	progress: number = 0;


	constructor(file: File) {
		this.file = file;
		this.filename = file.name;
		this.key = getUUID();
		this.perUrl = this.getPerUrl();
		this.outerUrl = null;
		this.exif = new ExifFactory(file);

		this.preLoading = false;

	}

	getPerUrl(): string {
		return this.file ? URL.createObjectURL(this.file) : '';
	}

	// 开始绘制预览
	async startPreview(params: { basic: OptionBasicValues, textList: { [key: string]: { items: ImageTextItem[]; x: TextTemplatePositionEnum }[] } }) {
		this.preLoading = true

		const img = new Image();
		const src = URL.createObjectURL(this.file as File);
		img.src = src

		img.onload = async () => {
			// blob 转 imageBitmap
			const imageBitmap = await createImageBitmap(img)
			const { width, height } = imageBitmap
			this.progress = 20

			// 解析参数，避免存在对象
			const currentParams = {
				basic: { ...params.basic },
				textList: { ...params.textList }
			}

			const worker = new WorkerManager();
			worker.createWorker("draw", new URL("../hooks/drawWorker.ts", import.meta.url).href);
			worker.postMessage("draw", { params: currentParams, image: imageBitmap, width: width ?? img.width, height: height ?? img.height }, (message: any) => {
				if (typeof message === 'number') {
					this.progress = message
				} else {
					this.outerUrl = URL.createObjectURL(message);
					this.preLoading = false
					worker.delete("draw");
				}
			});
		}
	}
}

export default ImageData;
