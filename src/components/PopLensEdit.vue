<script setup lang="ts">
import { Delete24Regular } from "@vicons/fluent";

import { defaultOptions } from '@/default/default-options.ts'
import { OptionLensValues, IconSize } from "@/interfaces/options.ts";

import { computed, ref, watch, PropType } from "vue";
import { useMessage } from "naive-ui";

import UploadFile from "./UploadFile.vue";
import FontSelect from "@/components/FontSelect.vue";
import MustText from "./MustText.vue";
import cameraSelect from "@/components/CameraSelect.vue";

const message = useMessage()

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	pre: {
		type: Object as PropType<OptionLensValues | null>,
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
	font: defaultOptions.fontFamily,
	size: defaultOptions.fontSize,
	color: defaultOptions.fontColor,
	italic: defaultOptions.fontItalic,
	bold: defaultOptions.fontBold,
	used: true,
	forcedUsed: false,
	description: null
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
			font: defaultOptions.fontFamily,
			size: defaultOptions.fontSize,
			color: defaultOptions.fontColor,
			italic: defaultOptions.fontItalic,
			bold: defaultOptions.fontBold,
			used: true,
			forcedUsed: false,
			description: null
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
		formValue.value.font = props.pre.font || defaultOptions.fontFamily
		formValue.value.size = props.pre.size || defaultOptions.fontSize
		formValue.value.color = props.pre.color || defaultOptions.fontColor
		formValue.value.italic = props.pre.italic || defaultOptions.fontItalic
		formValue.value.bold = props.pre.bold || defaultOptions.fontBold
		formValue.value.used = props.pre.used || false
		formValue.value.forcedUsed = props.pre.forcedUsed || false
		formValue.value.description = props.pre.description
	}
})
</script>

<template>
	<n-modal v-model:show="show" :title="isAdd ? '添加参数' : '编辑参数'" preset="card" size="huge" :mask-closable="false"
		:style="{ width: '600px' }" @update:show="onClose">
		<div class="pre-edit-pop">
			<n-grid x-gap="12" y-gap="16" :cols="6">
				<n-gi class="flex-end" :span="1">
					<must-text label="名称"></must-text>
				</n-gi>
				<n-gi :span="5">
					<n-input v-model:value="formValue.name" :disabled="formValue.type === 0"></n-input>
				</n-gi>
				<n-gi class="flex-end" :span="1">
					<must-text label="内容"></must-text>
				</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-radio-group name="radiogroup" v-model:value="formValue.contentType"
						:disabled="formValue.type === 0">
						<n-space>
							<n-radio key="0" :value="0"> 文本 </n-radio>
							<n-radio key="1" :value="1"> 图片 </n-radio>
						</n-space>
					</n-radio-group>
				</n-gi>
				<n-gi class="flex-start" :span="3" v-if="formValue.contentType == 0">
					<n-input v-model:value="formValue.contentText" :disabled="formValue.type === 0"></n-input>
				</n-gi>
				<n-gi class="flex-start" :span="3" v-if="formValue.contentType == 1">
					<img class="h-10 w-50 object-contain" v-if="formValue.contentImage" :src="formValue.contentImage" />
					<n-space vertical align="end" class="w-full">
						<upload-file :iconSize="IconSize.Mini"
							@on-change="($event) => formValue.contentImage = $event"></upload-file>
						<camera-select @on-choose="($event) => formValue.contentImage = $event"></camera-select>
					</n-space>
				</n-gi>
				<!-- 文字样式在类型为文字时使用 -->
				<n-gi class="flex-center color6 font-bold text-base" :span="6">
					文字样式
				</n-gi>
				<n-gi class="flex-end" :span="1">图片/字号</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-input-number :precision="2" :step="0.05" :min="0.2" :max="0.9" v-model:value="formValue.size"
						:disabled="!formValue.forcedUsed"></n-input-number>
				</n-gi>
				<n-gi class="flex-end" :span="1">颜色</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-color-picker :modes="['hex']" :show-alpha="false" v-model:value="formValue.color"
						:disabled="!formValue.forcedUsed"></n-color-picker>
				</n-gi>

				<n-gi class="flex-end" :span="1">粗体</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-switch size="small" v-model:value="formValue.bold" :disabled="!formValue.forcedUsed"></n-switch>
				</n-gi>
				<n-gi class="flex-end" :span="1">斜体</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-switch size="small" v-model:value="formValue.italic"
						:disabled="!formValue.forcedUsed"></n-switch>
				</n-gi>
				<n-gi class="flex-end" :span="1">字体</n-gi>
				<n-gi class="flex-start" :span="5">
					<font-select v-model:font="formValue.font" :disabled="!formValue.forcedUsed" />
					<span class="color3 ml-2 text-xl"
						:style="{ fontFamily: formValue.font || '', fontWeight: formValue.bold ? 'bold' : '', fontStyle: formValue.italic ? 'italic' : '' }">
						远山
					</span>
				</n-gi>
				<n-gi class="flex-end" :span="1">强制替换</n-gi>
				<n-gi class="flex-start" :span="5">
					<n-switch size="small" class="mx-2" v-model:value="formValue.forcedUsed"></n-switch>
					<span class="color9 text-xs">强制替换文字模板中的默认文字样式参数</span>
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
						<div>
							<div class="font-bold">确认删除该自定义参数吗？</div>
							<div class="text-xs">删除后模板中有使用该参数的文字将不会绘制该内容...</div>
						</div>
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
