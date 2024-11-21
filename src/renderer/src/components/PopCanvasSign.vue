<script setup lang="ts">
import { fontOptions } from '@renderer/default/font-options'

import { computed, ref } from 'vue';
import { useMessage } from 'naive-ui';

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['update:show'])

const show = computed(() => props.show)

const onClose = () => {
	emits('update:show', false)
}

const fontList = ref<{ label: string, value: string, key: string }[]>([
	...fontOptions,
])

const message = useMessage()

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

const maxlength = ref(60)
const font = ref('Wen')
const fontSize = ref(40)
const italic = ref(false)
const bold = ref(false)
const color = ref('#000000')
const letterSpace = ref(0)
const wordSpace = ref(0)

const text = ref<string>('')

// 初始化
const init = () => {
	console.log(canvas.value)
	if (!canvas.value) return

	ctx.value = canvas.value.getContext('2d') as CanvasRenderingContext2D;
	ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
	canvas.value.height = 0
	canvas.value.width = 0
}

// 清空
const clear = () => {
	text.value = ''
	font.value = 'Wen'
	fontSize.value = 40
	italic.value = false
	bold.value = false
	color.value = '#000000'
	letterSpace.value = 0
	wordSpace.value = 0
}

const draw = (text: string) => {
	if (!canvas.value || !ctx.value) return

	if (text.trim().length !== 0) {
		const { width, height } = getTextWidth()
		canvas.value.width = width + 20
		canvas.value.height = height
	} else {
		canvas.value.width = 0
		canvas.value.height = 0
	}

	ctx.value.textBaseline = 'middle';
	ctx.value.letterSpacing = `${letterSpace.value}px`;
	ctx.value.wordSpacing = `${wordSpace.value}px`;
	ctx.value.font = `${bold.value ? 'bold' : 'normal'} ${italic.value ? 'italic' : 'normal'} ${fontSize.value}px ${font.value}`;
	ctx.value.fillStyle = color.value;
	ctx.value.fillText(text, 10, canvas.value.height / 2);
}

// 计算绘制的文字的宽高
const getTextWidth = (): { width: number, height: number } => {
	if (!ctx.value) {
		return { width: 0, height: 0 }
	}
	ctx.value.letterSpacing = `${letterSpace.value}px`;
	ctx.value.wordSpacing = `${wordSpace.value}px`;
	ctx.value.font = `${bold.value ? 'bold' : 'normal'} ${italic.value ? 'italic' : 'normal'} ${fontSize.value}px ${font.value}`;
	return {
		width: ctx.value.measureText(text.value || '').width,
		height: ctx.value.measureText(text.value || '').fontBoundingBoxAscent + ctx.value.measureText(text.value || '').fontBoundingBoxDescent * 2
	};
}

const onChange = () => {
	if (!text.value) return
	// 校验内容是否为全部空格
	if (text.value.trim().length === 0) {
		if (!canvas.value) return
		canvas.value.getContext('2d')?.clearRect(0, 0, canvas.value.width, canvas.value.height);
		canvas.value.height = 0

		return
	}

	if (/[\u4e00-\u9fa5]/.test(text.value)) {
		maxlength.value = 40
		if (text.value.length > 40) {
			text.value = text.value.slice(0, 40)
			message.warning('内容过长')
		}
	} else {
		maxlength.value = 60
	}

	draw(text.value ?? '')
}

// 自定义上传字体加载
const uploadFont = (e: Event) => {
	const file = (e.target as HTMLInputElement).files?.[0]
	if (!file) return

	const name = file.name.split('.')[0].slice(0, 12)
	// 如果名字存在中文
	if (/[\u4e00-\u9fa5]/.test(name)) {
		message.error('字体文件名不支持中文');
		// 清空
		(e.target as HTMLInputElement).value = ''
		return
	}
	// 校验上传文件是否已经存在
	const isExist = fontList.value.some(item => item.key === name)
	if (isExist) {
		message.error('字体已存在');
		// 清空
		(e.target as HTMLInputElement).value = ''
		return
	}

	const reader = new FileReader()
	reader.onload = () => {
		if (reader.result) {
			const f = new FontFace(name, `url(${reader.result})`, {
				style: 'normal',
			});
			f.load().then(() => {
				document.fonts.add(f);
				// 添加到字体列表
				fontList.value.unshift({ label: name, value: name, key: name })
			}).catch(err => {
				console.log(err);
			}).finally(() => {
				// 清空
				(e.target as HTMLInputElement).value = ''
			})
		}
	}
	reader.readAsDataURL(file);
}

// 导出绘制内容为图片的函数
const exportDrawing = () => {
	if (!canvas.value || !ctx.value) return

	// 获取绘制内容的边界矩形
	const { left, top, width, height } = getDrawingBounds();

	// 创建一个新的Canvas，大小为绘制内容的边界矩形大小
	const exportCanvas = document.createElement('canvas');
	exportCanvas.width = width;
	exportCanvas.height = height;
	const exportCtx = exportCanvas.getContext('2d');
	if (!exportCtx) return

	// 将原Canvas中的绘制内容复制到新的Canvas中
	exportCtx.drawImage(canvas.value, left, top, width, height, 0, 0, width, height);

	// 将新Canvas转换为图片数据（这里以PNG格式为例）
	const dataURL = exportCanvas.toDataURL('image/png');

	// 创建一个临时的 <a> 标签，用于下载图片
	const a = document.createElement('a');
	a.href = dataURL;
	a.download = `sign-${Date.now()}.png`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

// 获取绘制内容边界矩形的函数
const getDrawingBounds = (): { left: number; top: number; width: number; height: number } => {
	if (!ctx.value || !canvas.value) return { left: 0, top: 0, width: 0, height: 0 };
	const imageData = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height);
	const pixels = imageData.data;
	let minX = canvas.value.width;
	let minY = canvas.value.height;
	let maxX = 0;
	let maxY = 0;

	for (let i = 0; i < pixels.length; i += 4) {
		if (pixels[i + 3] > 0) { // 只考虑透明度不为0的像素
			const x = (i / 4) % canvas.value.width;
			const y = Math.floor((i / 4) / canvas.value.width);

			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
		}
	}

	return {
		left: minX,
		top: minY,
		width: maxX - minX + 1,
		height: maxY - minY + 1
	};
};
</script>
<template>
	<n-modal v-model:show="show" title="字体签名转图片" preset="card" size="huge" :mask-closable="false"
		:style="{ width: '1000px' }" @update:show="onClose" @after-enter="init()" @after-leave="clear()">
		<div class="canvas-sign w-full max-w-200 mx-auto">
			<n-grid class="py-2" x-gap="32" y-gap="24" :cols="10">
				<n-gi :span="10">
					<n-input v-model:value="text" class="bg-color16 flex-1 mr-4 text-center" round size="large"
						type=" text" placeholder="请输入签名" :maxlength="maxlength" show-count clearable @input="onChange"
						@clear="draw('')"></n-input>
				</n-gi>
				<n-gi class="flex-start" :span="2">
					<span class="pr-2">斜体</span>
					<n-switch v-model:value="italic" @update:value="onChange"></n-switch>
				</n-gi>
				<n-gi class="flex-start" :span="2">
					<span class="pr-2">粗体</span>
					<n-switch v-model:value="bold" @update:value="onChange"></n-switch>
				</n-gi>
				<n-gi class="flex-start" :span="3">
					<span class="pr-2">颜色</span>
					<n-color-picker class="flex-1" v-model:value="color" @update:value="onChange"></n-color-picker>
				</n-gi>
				<n-gi class="flex-start" :span="3">
					<span class="pr-4">字号</span>
					<n-slider class="flex-1" :min="24" :max="120" v-model:value="fontSize"
						@dragend="onChange"></n-slider>
				</n-gi>
				<n-gi class="flex-start" :span="3">
					<span class="pr-4">字间距</span>
					<n-slider class="flex-1" v-model:value="letterSpace" @dragend="onChange"></n-slider>
				</n-gi>
				<n-gi class="flex-start" :span="3">
					<span class="pr-4">词间距</span>
					<n-slider class="flex-1" v-model:value="wordSpace" @dragend="onChange"></n-slider>
				</n-gi>
				<n-gi class="flex-start" :span="4">
					<span class="pr-4">字体</span>
					<n-input-group class="flex-1">
						<n-select v-model:value="font" :options="fontList" @update:value="onChange"></n-select>
						<div class="w-20 h-[34px] relative">
							<n-button class="w-full h-full" type="info">上传字体</n-button>
							<input class="w-full h-full opacity-0 absolute top-0 left-0" type="file" accept=".ttf"
								@change="uploadFont">
						</div>
					</n-input-group>

				</n-gi>
				<n-gi class="flex" :span="10">
					<div class="default-layout bg-color13 flex-1 min-h-10 py-4 px-10 overflow-x-auto rounded-l-xl">
						<canvas class="bg-transparent m-auto block" id="canvas" ref="canvas"></canvas>
					</div>
					<n-button class="h-full w-20 flex justify-center items-center rounded-r-xl cursor-pointer"
						type="info" :disabled="!text || text.trim().length === 0" @click="exportDrawing">导出</n-button>
				</n-gi>
			</n-grid>
		</div>
	</n-modal>
</template>