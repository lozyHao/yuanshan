import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		UnoCSS(),
		AutoImport({
			imports: [
				'vue',
				{
					'naive-ui': [
						'useDialog',
						'useMessage',
						'useNotification',
						'useLoadingBar'
					]
				}
			]
		}),
		Components({
			resolvers: [NaiveUiResolver()]
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'), // 配置 @ 指向 src 目录
		},
	},
})