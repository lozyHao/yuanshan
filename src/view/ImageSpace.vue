<script setup lang="ts">
import { Play24Filled, Delete24Filled, ChevronLeft24Filled, ChevronRight24Filled } from "@vicons/fluent";
import { CloudUpload } from '@vicons/tabler'

import { computed } from "vue";
import ImageData from "@/hooks/imageData";
import { useFileStore } from '@/store/file.ts'
import { useMessage, useDialog } from 'naive-ui'

import Options from "./components/Options.vue";
// import PreChoose from "./components/PreChoose.vue"; // TODO：预览保存，暂时不用
import PreImage from "./components/PreImage.vue";
import PreList from "./components/PreList.vue";

const store = useFileStore();
const message = useMessage()
const dialog = useDialog()

const fileList = computed<ImageData[]>(() => store._imageData)
const index = computed<number>(() => store._currentPreIndex)
const preLoading = computed(() => store._loading)

// 当前照片是否在 加载预览图中
const loading = computed(() => {
	return fileList.value[index.value]?.preLoading
})

// 选择文件
const handleFileChange = async (e: Event) => {
	const t = e.target as HTMLInputElement
	const isRepetition = await store.addFiles(Array.from(t.files as FileList))
	console.log(isRepetition)
	if (isRepetition) {
		message.warning(isRepetition)
	}
	// 选择结束
	t.value = ''
}

// 清空文件
const onClearAll = () => {
	if (fileList.value.length === 0) return
	dialog.warning({
		title: '警告',
		content: '你确定清空所有文件吗？',
		positiveText: '确定',
		negativeText: '取消',
		onPositiveClick: () => {
			store.reset()
		}
	})
}

const onNext = (type: number = 1) => {
	store.onNext(type)
}


// 开起/刷新预览
const onStart = () => {
	store.startPreview()
}
</script>

<template>
	<div class="work-space w-full h-full flex">
		<div class="bg-color16 w-80 h-full pt-[10px] overflow-y-auto shadow-xl">
			<!-- 配置 -->
			<options></options>
		</div>
		<div class="space-box bg-color15 relative flex flex-col">
			<!-- 顶部导航 -->
			<div
				class="flex-end bg-color16 border-color15 h-10 border-b-1 border-b-solid border-l-1 border-l-solid pr-4">
				<n-space size="small">
					<n-popover trigger="hover" :show-arrow="false">
						<template #trigger>
							<n-button class="h-8 w-8" quaternary type="warning" @click="onClearAll">
								<template #icon>
									<n-icon class="color-warning" :size="20" :component="Delete24Filled" />
								</template>
							</n-button>
						</template>
						<span>清空所有文件</span>
					</n-popover>
					<n-popover trigger="hover" :show-arrow="false">
						<template #trigger>
							<n-button class="h-8 w-8" quaternary type="info">
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

					<n-spin class="bg-opacity3-000 rounded-xl absolute top-0 left-0 z-10 w-full h-full" type="spinner"
						size="large" v-show="preLoading"></n-spin>
				</div>

				<div class="flex-center" v-if="fileList.length > 0" style="max-height:calc(100% - 48px)">
					<pre-image v-if="fileList.length > 0"></pre-image>
				</div>
				<div class="flex-center w-full h-10 mt-2" v-if="fileList.length > 0">
					<!-- 控件 -->
					<n-space size="small" align="center">
						<n-button strong secondary circle type="info" size='small' @click="onNext(0)">
							<template #icon>
								<n-icon :component="ChevronLeft24Filled" />
							</template>
						</n-button>
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
						<n-button strong secondary circle type="info" size='small' @click="onNext(1)">
							<template #icon>
								<n-icon :component="ChevronRight24Filled" />
							</template>
						</n-button>
					</n-space>
				</div>
				<div class="color9 absolute bottom-2 right-2">文件数 {{ fileList.length }} / 当前 {{ index + 1 }}</div>
			</div>
			<!-- 底部图片目录 -->
			<div class="bottom_bar flex-center flex-wrap w-full h-auto transition-all">
				<transition name="fade">
					<div class="nav" v-if="fileList.length > 0">
						<pre-list :list="fileList"> </pre-list>
					</div>
				</transition>
			</div>
		</div>
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
