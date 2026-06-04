<script setup>
import { useElementSize } from '@vueuse/core'

import { computed, ref } from 'vue';

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


// 画笔颜色
const penColor = ref('#000000');
// 画笔粗细
const penSize = ref(6);

const isDraw = ref(true) // true 为画笔 false 为橡皮擦

// 存储上一次鼠标移动的坐标
let prevX = 0;
let prevY = 0;

// 当前笔画的采样点，用于中点二次贝塞尔平滑
let points = [];

// 用于判断鼠标是否按下
let isDrawing = false;

// Canvas
const canvas = ref(null);
let ctx = null;

// 在组件挂载时初始化Canvas
const init = () => {
	const canvasBox = document.getElementById('canvas-box')
	canvas.value.width = canvasBox.offsetWidth;
	canvas.value.height = canvasBox.offsetHeight;
	ctx = canvas.value.getContext('2d');

	canvas.value.addEventListener('mousedown', startDrawing);
	canvas.value.addEventListener('mousemove', (e) => {
		if (isDraw.value) {
			draw(e)
		} else {
			erase(e)
		}
	});
	canvas.value.addEventListener('mouseup', stopDrawing);
	// 鼠标离开了画布，停止绘制
	canvas.value.addEventListener('mouseenter', () => {
		if (!isDraw.value) {
			isErase.value = true
		}
	});
	canvas.value.addEventListener('mouseleave', () => {
		isErase.value = false
		stopDrawing();
	})
}

// 清除
const clear = () => {
	clearCanvas()
	isErase.value = false
	isDraw.value = true
}

// 将鼠标坐标转换为画布内部坐标（兼容画布位图尺寸与 CSS 显示尺寸不一致的情况）
const getPos = (e) => {
	const rect = canvas.value.getBoundingClientRect();
	const scaleX = canvas.value.width / rect.width;
	const scaleY = canvas.value.height / rect.height;
	return {
		x: (e.clientX - rect.left) * scaleX,
		y: (e.clientY - rect.top) * scaleY
	};
};

// 鼠标按下事件处理函数
const startDrawing = (e) => {
	isDrawing = true;
	const { x, y } = getPos(e);
	prevX = x;
	prevY = y;
	points = [{ x, y }];

	ctx.strokeStyle = penColor.value;
	ctx.fillStyle = penColor.value;
	ctx.lineWidth = penSize.value;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';

	// 单击即落点：先画一个圆点，避免点一下没有痕迹
	ctx.beginPath();
	ctx.arc(x, y, penSize.value / 2, 0, Math.PI * 2);
	ctx.fill();
};

// 平滑连续绘制：经过相邻采样点中点的二次贝塞尔曲线，保证笔迹连贯、不断点
const draw = (e) => {
	if (!isDrawing) return;

	const { x, y } = getPos(e);
	points.push({ x, y });

	ctx.lineWidth = penSize.value;
	ctx.strokeStyle = penColor.value;

	const n = points.length;
	if (n < 3) {
		// 起笔阶段采样点不足，先用直线连接
		ctx.beginPath();
		ctx.moveTo(prevX, prevY);
		ctx.lineTo(x, y);
		ctx.stroke();
	} else {
		// 以上一个采样点为控制点，前后两段中点为起止点，分段衔接成平滑曲线
		const p0 = points[n - 3];
		const p1 = points[n - 2];
		const p2 = points[n - 1];
		const mid1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
		const mid2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
		ctx.beginPath();
		ctx.moveTo(mid1.x, mid1.y);
		ctx.quadraticCurveTo(p1.x, p1.y, mid2.x, mid2.y);
		ctx.stroke();
	}

	prevX = x;
	prevY = y;
}
// 擦除函数
const eraseX = ref(0)
const eraseY = ref(0)
const isErase = ref(false)
const erase = (e) => {
	const { x: currentX, y: currentY } = getPos(e);

	// 更新橡皮擦预览框位置
	eraseX.value = currentX - penSize.value / 2
	eraseY.value = currentY - penSize.value / 2

	if (!isDrawing) return;

	// 获取需要擦除区域的图像数据
	const imageData = ctx.getImageData(
		currentX - penSize.value / 2,
		currentY - penSize.value / 2,
		penSize.value,
		penSize.value
	);
	const pixels = imageData.data;

	// 将擦除区域内像素的透明度设置为0
	for (let i = 3; i < pixels.length; i += 4) {
		pixels[i] = 0;
	}

	// 将修改后的图像数据放回画布
	ctx.putImageData(
		imageData,
		currentX - penSize.value / 2,
		currentY - penSize.value / 2
	);
};

// 鼠标抬起事件处理函数
const stopDrawing = () => {
	isDrawing = false;
};

// 清空画布
const clearCanvas = () => {
	ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
}

// 导出绘制内容为图片的函数
const exportDrawing = () => {
	// 获取绘制内容的边界矩形
	const { left, top, width, height } = getDrawingBounds();

	// 创建一个新的Canvas，大小为绘制内容的边界矩形大小
	const exportCanvas = document.createElement('canvas');
	exportCanvas.width = width;
	exportCanvas.height = height;
	const exportCtx = exportCanvas.getContext('2d');

	// 将原Canvas中的绘制内容复制到新的Canvas中
	exportCtx.drawImage(canvas.value, left, top, width, height, 0, 0, width, height);

	// 将新Canvas转换为图片数据（这里以PNG格式为例）
	const dataURL = exportCanvas.toDataURL('image/png');

	// 创建一个临时的 <a> 标签，用于下载图片
	const a = document.createElement('a');
	a.href = dataURL;
	a.download = `drawing-${Date.now()}.png`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

// 获取绘制内容边界矩形的函数
const getDrawingBounds = () => {
	const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height);
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

const canvasBox = ref(null)
const { width } = useElementSize(canvasBox)

watch(() => width.value, (newVal) => {
	canvas.value.width = newVal
})
</script>

<template>
	<n-modal v-model:show="show" title="画板" preset="card" size="huge" :mask-closable="false" :style="{ width: '90%' }"
		@update:show="onClose" @after-enter="init()" @after-leave="clear()">
		<div ref="canvasBox" id="canvas-box"
			class="relative w-full h-110 mx-auto overflow-hidden border-1 border-solid border-#ccc">
			<canvas class="bg-transparent relative z-1 w-full h-full" ref="canvas"></canvas>
			<div v-show="isErase" class="erase bg-#00000040 border border-#00000080 border-solid absolute z-0"
				ref="eraseRef" :style="{
					width: `${penSize}px`,
					height: `${penSize}px`,
					left: `${eraseX}px`,
					top: `${eraseY}px`,
				}"></div>
		</div>

		<div class="w-full mt-2">
			<n-grid x-gap="32" y-gap="24" :cols="12">
				<n-gi class="flex-start" :span="3">
					<span class="pr-4">画笔颜色</span>
					<n-color-picker class="flex-1" v-model:value="penColor"></n-color-picker>
				</n-gi>
				<n-gi class="flex-start" :span="4">
					<span class="pr-4">画笔粗细</span>
					<n-slider class="flex-1" :min="1" :max="20" v-model:value="penSize"></n-slider>
				</n-gi>
				<n-gi class="flex-start" :span="2">
					<span>橡皮擦</span>
					<n-switch class="mx-2" v-model:value="isDraw"></n-switch>
					<span>画笔</span>
				</n-gi>
				<n-gi class="flex-end" :span="3">
					<n-button class="mr-4" type="warning" @click="clearCanvas">
						清除
					</n-button>
					<n-button class="w-30" type="info" @click="exportDrawing">
						导出/PNG
					</n-button>
				</n-gi>

			</n-grid>
		</div>
	</n-modal>
</template>