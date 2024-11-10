import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import path from 'path';

export default defineConfig(() => {
	return {
		plugins: [
			vue(),
			electron({
				entry: './electron/main/index.js',
			}),
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
			renderer(),
			Components({
				resolvers: [NaiveUiResolver()]
			})
		],
		css: {
			preprocessorOptions: {
				less: {
					additionalData: '@import "@/assets/styles/theme.less";',
					javascriptEnabled: true,
				},
			},
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'), // 配置 @ 指向 src 目录
			},
		},
		optimizeDeps: {
			exclude: ['electron'],
		}
	}
})