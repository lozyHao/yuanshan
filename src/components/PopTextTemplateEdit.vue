<script setup lang="ts">
import { Delete24Regular } from "@vicons/fluent";

import { computed, ref, watch, PorpType } from "vue";
import { OptionTextTemplateValues, TextTemplatePositionEnum } from "@/interfaces/options.ts";
import { useOptionTextStore } from "@/store/optionText";
import { defaultOptions } from "@/default/default-options.ts";

import { useMessage } from "naive-ui";

import FontSelect from "@/components/FontSelect.vue";
import tempSelect from "@/components/templateChoose.vue";

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	pre: {
		type: Object as PorpType<OptionTextTemplateValues>,
		default: null,
	},
});
const emits = defineEmits(["update:show", "onSubmit", "onDelete"]);

const message = useMessage()

const store = useOptionTextStore()
const show = computed(() => props.show);
const isAdd = ref(true);

const formValue = ref<OptionTextTemplateValues>({
	key: null,
	type: 1,
	name: null,
	content: null,
	font: defaultOptions.fontFamily,
	size: defaultOptions.fontSize,
	color: defaultOptions.fonColor,
	italic: defaultOptions.fontItalic,
	bold: defaultOptions.fontBold,
	order: 1,
	position: TextTemplatePositionEnum.NO
});

const onClose = () => {
	emits("update:show", false);
};

const onSubmit = () => {
	// 校验name\content
	if (!formValue.value.name || !formValue.value.content) {
		message.warning("请输入模板名称和内容");
		return
	}
	if (store.checkEdit()) {
		message.warning("模板名称已存在");
		return
	}

	emits("onSubmit", formValue.value);
	emits("update:show", false);
};

const onRemove = () => {
	emits("onDelete", formValue.value.key);
	emits("update:show", false);
}

// 选择模板添加到内容中
const chooseTemplate = (value) => {
	if (!value) return
	formValue.value.content += ` ${value}`
}

// 接受父组件数据
watch(() => props.show, (newVal) => {
	console.log(newVal)
	if (!newVal) {
		formValue.value = {
			key: null,
			type: 0,
			name: null,
			content: null,
			font: defaultOptions.fontFamily,
			size: defaultOptions.fontSize,
			color: defaultOptions.color,
			italic: defaultOptions.italic,
			bold: defaultOptions.bold,
			order: 1,
			position: TextTemplatePositionEnum.FOOTER
		}
	}
	if (newVal) {
		if (!props.pre?.key) {
			isAdd.value = true;
			return
		}
		isAdd.value = false;
		formValue.value.key = props.pre.key;
		formValue.value.type = props.pre.type;
		formValue.value.name = props.pre.name;
		formValue.value.content = props.pre.content;
		formValue.value.font = props.pre.font;
		formValue.value.size = props.pre.size;
		formValue.value.color = props.pre.color;
		formValue.value.italic = props.pre.italic;
		formValue.value.bold = props.pre.bold;
		formValue.value.order = props.pre.order;
		formValue.value.position = props.pre.position;
	}
})
</script>

<template>
	<n-modal v-model:show="show" :title="isAdd ? '添加参数' : '编辑参数'" preset="card" size="huge" :mask-closable="false"
		:style="{ width: '600px' }" @update:show="onClose">
		<div class="pop-text-template-edit">
			<n-grid x-gap="12" y-gap="16" :cols="6">
				<n-gi class="flex-end" :span="1">模板名称</n-gi>
				<n-gi :span="5">
					<n-input v-model:value="formValue.name"></n-input>
				</n-gi>
				<n-gi class="flex-end" :span="1">内容</n-gi>
				<n-gi class="flex-start" :span="5">
					<n-input-group>
						<n-input v-model:value="formValue.content"></n-input>
						<temp-select @update="chooseTemplate"></temp-select>
					</n-input-group>
				</n-gi>
				<n-gi class="flex-center color6 font-bold text-base" :span="6">
					文字样式
				</n-gi>
				<n-gi class="flex-end" :span="1">字号</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-input-number v-model:value="formValue.size"></n-input-number>
				</n-gi>
				<n-gi class="flex-end" :span="1">颜色</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-color-picker v-model:value="formValue.color" :modes="['hex']"
						:show-alpha="false"></n-color-picker>
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
				<n-gi class="flex-start" :span="2">
					<font-select v-model:font="formValue.font" />
				</n-gi>
				<n-gi class="flex-start" :span="3"> </n-gi>

				<n-gi :span="3">
					<n-popconfirm @positive-click="onRemove" :disabled="formValue.key == null">
						<template #trigger>
							<n-button type="error" strong secondary :disabled="formValue.key == null">
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
