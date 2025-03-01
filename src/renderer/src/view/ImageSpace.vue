<script setup lang="ts">
import {
	Play24Filled,
	Delete24Filled,
	Copy24Regular,
	Clipboard24Regular,
} from "@vicons/fluent";
import { CloudUpload } from "@vicons/tabler";

import { computed, ref, onMounted } from "vue";
import { useMessage, useDialog } from "naive-ui";

import ImageData from "@renderer/hooks/imageData";
import { useFileStore } from "@renderer/store/file";
import { useOptionBasicStore } from "@renderer/store/optionBasic";
import { useOptionTextStore } from "@renderer/store/optionText";
import { useOptionLensStore } from "@renderer/store/optionLens";

import { TextTemplatePositionEnum } from "@renderer/interfaces/options"
import { fontOptions } from "@renderer/default/font-options";
import { loadFont } from "@renderer/utils/tool";
import { ExifData } from "@renderer/hooks/exifFactory";

import Options from "./components/Options.vue";
import PreImage from "./components/PreImage.vue";
import PreList from "./components/PreList.vue";
import ImageDetail from "@renderer/components/ImageDetail.vue";
import PopOutput from "@renderer/components/PopOutput.vue";

const store = useFileStore();

// 获取参数 stroe
const basicStore = useOptionBasicStore();
const textStore = useOptionTextStore();
const lensStore = useOptionLensStore();

const message = useMessage();
const dialog = useDialog();

const fileList = computed<ImageData[]>(() => store._imageData);
const index = computed<number>(() => store._currentPreIndex);
const preLoading = computed(() => store._loading);

// 当前照片是否在 加载预览图中
const loading = computed(() => {
	return fileList.value[index.value]?.preLoading;
});
const progress = computed(() => {
	return fileList.value[index.value]?.progress || 0;
});


// 文本的位置中心配置项
const headerTextPosition = computed<[number, number, number]>(() => {
	return textStore.getTextPosition(TextTemplatePositionEnum.HEADER)
})
const middleTextPosition = computed<[number, number, number]>(() => {
	return textStore.getTextPosition(TextTemplatePositionEnum.MIDDLE)
})
const footerTextPosition = computed<[number, number, number]>(() => {
	return textStore.getTextPosition(TextTemplatePositionEnum.FOOTER)
})

// 选择文件
const handleFileChange = async (e: Event) => {
	const t = e.target as HTMLInputElement;
	const isRepetition = await store.addFiles(Array.from(t.files as FileList));
	if (isRepetition) {
		message.success(isRepetition);
	}
	// 选择结束
	t.value = "";
};

// 清空文件
const onClearAll = () => {
	if (fileList.value.length === 0) return;
	dialog.warning({
		title: "警告",
		content: "你确定清空所有文件吗？",
		positiveText: "确定",
		negativeText: "取消",
		onPositiveClick: () => {
			store.reset();
		},
	});
};

// 开起/刷新预览
const onStart = () => {
	store.startPreview({
		basic: basicStore._data,
		text: textStore._data,
		lens: lensStore._data,
		textPosition: { headerTextPosition: headerTextPosition.value, middleTextPosition: middleTextPosition.value, footerTextPosition: footerTextPosition.value }
	});
};

// 开始输出
const outputPopShow = ref<boolean>(false);
const onOutput = () => {
	if (!basicStore._data.outputPath) {
		message.warning("请先设置输出路径");
		return
	}
	outputPopShow.value = true;
};

// 复制exif报告数据
const onCopy = () => {
	const jsonData = JSON.stringify(store._imageData[index.value]?.exif.exif);
	const formattedData = JSON.stringify(JSON.parse(jsonData), null, 2); // 使用 2 个空格缩进进行格式化
	navigator.clipboard
		.writeText(formattedData)
		.then(() => {
			message.success("复制成功");
		})
		.catch(() => {
			message.error("复制失败");
		});
};

// 弹窗展示详细图片和exif信息列表，并可canvas截图导出
const currentImageExif = ref<ExifData>({});
const currentImage = ref<string>("");
const showImageInfo = ref(false);
const onShowImageInfo = () => {
	currentImageExif.value = store._imageData[index.value]?.exif.exif;
	currentImage.value = store._imageData[index.value]?.perUrl;

	if (currentImageExif.value) {
		showImageInfo.value = true;
		return;
	}
	message.error("照片exif信息未加载完成");
};

// 初始化加载字体
onMounted(async () => {
	const res = await loadFont(fontOptions);
	if (res) {
		message.success("字体初始化完成");
	} else {
		message.error("字体加载失败，部分字体可能无法显示");
	}
});
</script>

<template>
	<div class="work-space w-full h-full flex">
		<div class="bg-color16 w-80 h-full pt-[10px] overflow-y-auto shadow-xl">
			<!-- 配置 -->
			<options />
		</div>
		<div class="space-box bg-color15 relative flex flex-col">
			<!-- 顶部导航 -->
			<div
				class="flex-end bg-color16 border-color15 h-10 border-b-1 border-b-solid border-l-1 border-l-solid pr-4">
				<n-space size="small">
					<n-popover trigger="hover" :show-arrow="false" :disabled="fileList.length === 0">
						<template #trigger>
							<n-button class="h-8 w-8" quaternary type="warning" :disabled="fileList.length === 0"
								@click="onClearAll">
								<template #icon>
									<n-icon class="color-warning" :size="20" :component="Delete24Filled" />
								</template>
							</n-button>
						</template>
						<span>清空所有文件</span>
					</n-popover>
					<n-popover trigger="hover" :show-arrow="false">
						<template #trigger>
							<n-button class="h-8 w-8" quaternary type="info" :disabled="fileList.length === 0"
								@click="onOutput">
								<template #icon>
									<n-icon class="color-info" :size="20" :component="Play24Filled" />
								</template>
							</n-button>
						</template>
						<span>开始输出</span>
					</n-popover>
					<!-- <pre-choose></pre-choose> -->
				</n-space>
			</div>
			<!-- 工作区 -->
			<div class="space default-layout w-full flex-1 p-4 overflow-y-auto flex-center flex-col relative">
				<!-- 文件上传 -->
				<div v-if="fileList.length === 0"
					class="upload bg-color16 w-full max-w-200 aspect-video flex-center rounded-xl flex-col cursor-pointer relative transition-all hover:shadow-xl relative">
					<n-icon class="color6 mb-2" size="48" :component="CloudUpload" />
					<n-text style="font-size: 16px">
						点击或者拖动文件到该区域来上传
					</n-text>
					<input class="absolute top-0 left-0 w-full h-full cursor-pointer opacity-0" type="file" multiple
						accept="image/jpg,image/jpeg,image/png" @change="handleFileChange">
					<n-spin v-show="preLoading"
						class="bg-opacity3-000 rounded-xl absolute top-0 left-0 z-10 w-full h-full" type="spinner"
						size="large" />
				</div>

				<div v-if="fileList.length > 0" class="flex-center" style="max-height: calc(100% - 48px)">
					<pre-image v-if="fileList.length > 0" />
				</div>
				<div v-if="fileList.length > 0" class="flex-center w-full h-10 mt-2">
					<!-- 控件 -->
					<n-space size="small" align="center">
						<n-popover trigger="hover" :show-arrow="false">
							<template #trigger>
								<n-button strong secondary circle type="info" size="small" @click="onShowImageInfo">
									<template #icon>
										<n-icon :component="Clipboard24Regular" />
									</template>
								</n-button>
							</template>
							<span>报告预览</span>
						</n-popover>
						<n-popover trigger="hover" :show-arrow="false">
							<template #trigger>
								<n-button strong secondary circle type="info" size="small" @click="onCopy">
									<template #icon>
										<n-icon :component="Copy24Regular" />
									</template>
								</n-button>
							</template>
							<span>复制参数</span>
						</n-popover>
						<n-popover trigger="hover" :show-arrow="false">
							<template #trigger>
								<n-button strong secondary circle type="info" size="large" :loading="loading"
									@click="onStart">
									<template #icon>
										<n-icon :component="Play24Filled" />
									</template>
								</n-button>
							</template>
							<span>[开始/刷新] 预览</span>
						</n-popover>
					</n-space>
				</div>
				<div class="color9 absolute bottom-3 right-3">
					文件数 {{ fileList.length }} / 当前 {{ index + 1 }}
				</div>
				<div v-if="loading"
					class="progress bg-color-info flex-center h-3 absolute bottom-[1px] transition-all text-[8px] text-#fff"
					:style="{ width: progress + '%' }">
					{{ progress }}%
				</div>
			</div>
			<!-- 底部图片目录 -->
			<div class="bottom_bar flex-center flex-wrap w-full h-auto transition-all">
				<transition name="fade">
					<div v-if="fileList.length > 0" class="nav">
						<pre-list :list="fileList" />
					</div>
				</transition>
			</div>
		</div>
		<image-detail v-model:show="showImageInfo" :exif="currentImageExif" :image="currentImage" />
		<!-- 开始输出弹窗 -->
		<pop-output v-model:show="outputPopShow"></pop-output>
	</div>
</template>

<style lang="less" scoped>
.space-box {
	width: calc(100% - 320px);
}

.bottom_bar {
	height: auto;

	&>.nav {
		width: 100%;
		height: 72px;
	}
}
</style>
