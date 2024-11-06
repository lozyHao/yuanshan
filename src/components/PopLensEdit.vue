<script setup lang="ts">
import { Delete24Regular } from "@vicons/fluent";

import { defaultOptions } from '@/default/default-options.ts'
import { OptionLensValues, IconSize } from "@/interfaces/options.ts";

import { computed, ref, watch } from "vue";
import { useMessage } from "naive-ui";

import UploadFile from "./UploadFile.vue";
import FontSelect from "@/components/FontSelect.vue";

const message = useMessage()

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	pre: {
		type: Object,
		default: null,
	},
});
const emits = defineEmits(["update:show", 'onSubmit', 'onDelete']);

const show = computed(() => props.show);
const isAdd = ref(true);

const formValue = ref<OptionLensValues>({
	key: null,
	type: 1,
	name: null,
	contentType: 0,
	contentText: null,
	contentImage: null,
	forcedUsed: false,
	font: defaultOptions.fontFamily,
	fontUsed: false,
	size: defaultOptions.fontSize,
	color: defaultOptions.fontColor,
	italic: defaultOptions.fontItalic,
	bold: defaultOptions.fontBold,
	used: true,
});

const onClose = () => {
	emits("update:show", false);
};

const onSubmit = () => {
	if (!onValidate()) return
	emits("onSubmit", formValue.value);
	emits("update:show", false);
};

const onRemove = () => {
	emits("onDelete", formValue.value);
	emits("update:show", false);
};

// 校验内容和图片
const onValidate = (): boolean => {
	if (formValue.value.type === 0) {
		return true
	}
	if (formValue.value.type === 1 && !formValue.value.name) {
		message.warning("请输入模板名称");
		return false;
	}
	if (formValue.value.contentType == 0 && !formValue.value.contentText) {
		message.warning("请输入内容");
		return false;
	}
	if (formValue.value.contentType == 1 && !formValue.value.contentImage) {
		message.warning("请上传图片");
		return false;
	}
	return true
}


// 接受父组件数据
watch(() => props.show, (newVal) => {
	if (!newVal) {
		formValue.value = {
			key: null,
			type: 1,
			name: null,
			contentType: 0,
			contentText: null,
			contentImage: null,
			forcedUsed: false,
			font: defaultOptions.fontFamily,
			size: defaultOptions.fontSize,
			color: defaultOptions.fontColor,
			italic: defaultOptions.fontItalic,
			bold: defaultOptions.fontBold,
			used: true,
		}
	}
	if (newVal) {
		if (!props.pre?.key) {
			isAdd.value = true;
			return
		}
		isAdd.value = false;
		formValue.value.key = props.pre.key
		formValue.value.type = props.pre.type
		formValue.value.name = props.pre.name
		formValue.value.contentType = props.pre.contentType || 0
		formValue.value.contentText = props.pre.contentText || null
		formValue.value.contentImage = props.pre.contentImage || null
		formValue.value.forcedUsed = props.pre.forcedUsed || false
		formValue.value.font = props.pre.font || defaultOptions.fontFamily
		formValue.value.size = props.pre.size || defaultOptions.fontSize
		formValue.value.color = props.pre.color || defaultOptions.fontColor
		formValue.value.italic = props.pre.italic || defaultOptions.fontItalic
		formValue.value.bold = props.pre.bold || defaultOptions.fontBold
		formValue.value.used = props.pre.used || true
	}
})
</script>

<template>
	<n-modal v-model:show="show" :title="isAdd ? '添加参数' : '编辑参数'" preset="card" size="huge" :mask-closable="false"
		:style="{ width: '600px' }" @update:show="onClose">
		<div class="pre-edit-pop">
			<n-grid x-gap="12" y-gap="16" :cols="6">
				<n-gi class="flex-end" :span="1" v-if="formValue.type === 1">模板名称</n-gi>
				<n-gi :span="5" v-if="formValue.type === 1">
					<n-input v-model:value="formValue.name"></n-input>
				</n-gi>
				<n-gi class="flex-end" :span="1">内容</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-radio-group name="radiogroup" v-model:value="formValue.contentType">
						<n-space>
							<n-radio key="0" :value="0"> 文本 </n-radio>
							<n-radio key="1" :value="1"> 图片 </n-radio>
						</n-space>
					</n-radio-group>
				</n-gi>
				<n-gi class="flex-start" :span="3">
					<n-input v-if="formValue.contentType == 0" v-model:value="formValue.contentText"></n-input>
					<div class="flex-start" v-if="formValue.contentType == 1">
						<upload-file :iconSize="IconSize.Mini"
							@on-change="($event) => formValue.contentImage = $event"></upload-file>
						<n-image class="h-10 flex-1 ml-2" object-fit="contain" v-if="formValue.contentImage"
							:src="formValue.contentImage">
						</n-image>
					</div>
				</n-gi>
				<n-gi class="flex-end" :span="1">强制使用</n-gi>
				<n-gi class="flex-start" :span="2">
					<!-- 系统默认参数设置是否强制使用 -->
					<n-switch size="small" v-model:value="formValue.forcedUsed"></n-switch>
				</n-gi>
				<!-- 文字样式在类型为文字时使用 -->
				<n-gi class="flex-center color6 font-bold text-base" :span="6">
					文字样式
				</n-gi>
				<n-gi class="flex-end" :span="1">字号</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-input-number v-model:value="formValue.size"></n-input-number>
				</n-gi>
				<n-gi class="flex-end" :span="1">颜色</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-color-picker :modes="['hex']" :show-alpha="false"
						v-model:value="formValue.color"></n-color-picker>
				</n-gi>

				<n-gi class="flex-end" :span="1">粗体</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-switch size="small" v-model:value="formValue.bold"></n-switch>
				</n-gi>
				<n-gi class="flex-end" :span="1">斜体</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-switch size="small" v-model:value="formValue.italic"></n-switch>
				</n-gi>
				<n-gi class="flex-end" :span="1">字体</n-gi>
				<n-gi class="flex-start" :span="4">
					<font-select v-model:font="formValue.font" />
					<n-switch size="small" class="mx-2" v-model:value="formValue.used"></n-switch>
					<div>强制替换</div>
				</n-gi>

				<n-gi :span="3">
					<n-popconfirm @positive-click="onRemove" :disabled="formValue.type === 0 || !formValue.key">
						<template #trigger>
							<n-button type="error" strong secondary :disabled="formValue.type === 0 || !formValue.key">
								<template #icon>
									<n-icon :component="Delete24Regular" />
								</template>
							</n-button>
						</template>
						确认删除该模板吗？
					</n-popconfirm>
				</n-gi>
				<n-gi class="flex-end" :span="3">
					<n-button type="warning" @click="onClose">取消</n-button>
					<n-button class="ml-4" type="info" @click="onSubmit">保存</n-button>
				</n-gi>
			</n-grid>
		</div>
	</n-modal>
</template>
