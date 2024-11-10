<script setup lang="ts">
import { Delete24Regular } from "@vicons/fluent";

import { computed, ref, watch, PropType } from "vue";
import { OptionTextTemplateValues, TextTemplatePositionEnum } from "@/interfaces/options.ts";
import { defaultOptions } from "@/default/default-options.ts";
import { useOptionLensStore } from '@/store/optionLens.ts'

import { useMessage } from "naive-ui";

import FontSelect from "@/components/FontSelect.vue";
import MustText from "./MustText.vue";

const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
	pre: {
		type: Object as PropType<OptionTextTemplateValues | null>,
		default: null,
	},
});
const emits = defineEmits(["update:show", "onSubmit", "onDelete"]);

const message = useMessage()

const lenStore = useOptionLensStore()

const tempOptions = computed(() => {
	let list: { label: string; value: string, description: string }[] = []
	lenStore.getValue().forEach((item) => {
		list.push({
			label: item.name || '',
			value: item.key || '',
			description: item.description || ''
		})
	})
	return list
})
// 模板完整提示信息
const templateInfo = computed(() => {
	let str = ''
	if (!formValue.value.content) return ""
	formValue.value.content.forEach((item) => {
		const temp = tempOptions.value.find((item2) => item2.value === item)?.description
		if (temp) str += `${temp} `
	})

	return str
})


const show = computed(() => props.show);
const isAdd = ref(true);

const formValue = ref<OptionTextTemplateValues>({
	key: null,
	type: 1,
	name: null,
	content: null,
	font: defaultOptions.fontFamily,
	size: defaultOptions.fontSize,
	color: defaultOptions.fontColor,
	italic: defaultOptions.fontItalic,
	bold: defaultOptions.fontBold,
	position: TextTemplatePositionEnum.NO
});

const onClose = () => {
	emits("update:show", false);
};

const onSubmit = () => {
	// 校验name\content
	if (!formValue.value.name || !formValue.value.content || !formValue.value.content.length || !formValue.value.size) {
		message.warning("您有必须项未填写");
		return
	}

	emits("onSubmit", formValue.value);
	emits("update:show", false);
};

const onRemove = () => {
	emits("onDelete", formValue.value.key);
	emits("update:show", false);
}

// 接受父组件数据
watch(() => props.show, (newVal) => {
	if (!newVal) {
		formValue.value = {
			key: null,
			type: 0,
			name: null,
			content: null,
			font: defaultOptions.fontFamily,
			size: defaultOptions.fontSize,
			color: defaultOptions.fontColor,
			italic: defaultOptions.fontItalic,
			bold: defaultOptions.fontBold,
			position: TextTemplatePositionEnum.NO
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
		formValue.value.position = props.pre.position;
	}
})
</script>

<template>
	<n-modal v-model:show="show" :title="isAdd ? '添加参数' : '编辑参数'" preset="card" size="huge" :mask-closable="false"
		:style="{ width: '600px' }" @update:show="onClose">
		<div class="pop-text-template-edit">
			<n-grid x-gap="12" y-gap="16" :cols="6">
				<n-gi class="flex-end" :span="1">
					<must-text label="模板名称"></must-text>
				</n-gi>
				<n-gi :span="5">
					<n-input v-model:value="formValue.name"></n-input>
				</n-gi>
				<n-gi class="flex-end" :span="1">
					<must-text label="内容"></must-text>
				</n-gi>
				<n-gi :span="5">
					<n-select v-model:value="formValue.content" responsive multiple :options="tempOptions"
						max-tag-count="responsive" clearable />
					<div class="color9 text-xs pt-2" v-if="templateInfo">{{ templateInfo }}</div>
				</n-gi>
				<n-gi class="flex-center color6 font-bold text-base" :span="6">
					文字样式
				</n-gi>
				<n-gi class="flex-end" :span="1">
					<must-text label="图片/字号"></must-text>
				</n-gi>
				<n-gi class="flex-start" :span="2">
					<n-input-number v-model:value="formValue.size" :step="0.05" :min="0.2" :max="0.9"></n-input-number>
				</n-gi>
				<n-gi class="flex-end" :span="1">颜色
				</n-gi>
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
				<n-gi class="flex-start" :span="3">
					<font-select v-model:font="formValue.font" />
					<span class="color3 ml-2 text-xl"
						:style="{ fontFamily: formValue.font, fontWeight: formValue.bold ? 'bold' : '', fontStyle: formValue.italic ? 'italic' : '' }">远山</span>
				</n-gi>
				<n-gi class="flex-start" :span="2"> </n-gi>

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
