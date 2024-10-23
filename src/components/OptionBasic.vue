<script setup lang="ts">
import { Settings24Regular, Eye24Filled } from '@vicons/fluent'
</script>

<template>
	<div class="option-basic">
		<n-form labelPlacement="left" inline label-width="100">
			<n-grid x-gap="12" :cols="3">
				<n-gi :span="2">
					<n-form-item label="输出目录">
						<n-input-group>
							<n-input placeholder="输出目录" disabled />
							<n-button text class="pl-3">
								<n-icon :size="24" :component="Eye24Filled" />
							</n-button>
							<n-button text class="pl-3">
								<n-icon :size="24" :component="Settings24Regular" />
							</n-button>
						</n-input-group>

					</n-form-item>
				</n-gi>
				<n-gi :span="3">
					模式
				</n-gi>
				<n-gi>
					<n-form-item label="主图占比">
						<n-slider :step="5" />
					</n-form-item>
				</n-gi>
				<n-gi>
					<n-form-item label="通用字体">
						<n-input placeholder="文本间距" />
					</n-form-item>
				</n-gi>
				<n-gi>
					<n-form-item label="文字背景">
						<n-switch />
						<n-color-picker modes="rgb" :show-alpha='false' />
					</n-form-item>
				</n-gi>
				<n-gi>
					<n-form-item label="圆角大小">
						<n-slider :step="5" />
					</n-form-item>
				</n-gi>
				<n-gi>
					<n-form-item label="阴影大小">
						<n-slider :step="5" />
					</n-form-item>
				</n-gi>
				<n-gi>
					<n-form-item label="文字位置">
						<n-select :options="[]" />
					</n-form-item>
				</n-gi>
				<n-gi>
					<n-form-item label="纯色背景">
						<n-switch />
						<n-color-picker modes="rgb" :show-alpha='false' disabled />
					</n-form-item>
				</n-gi>
				<n-gi>
					<n-form-item label="输出宽高比">
						<n-select :options="[]" />
					</n-form-item>
				</n-gi>
				<n-gi>
					<n-form-item label="横屏输出">
						<n-switch />
					</n-form-item>
				</n-gi>
				<n-gi>
					<n-form-item label="输出质量">
						<n-slider :step="5" />
					</n-form-item>
				</n-gi>
			</n-grid>
		</n-form>
	</div>
</template>