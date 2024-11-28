import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()]
	},
	preload: {
		plugins: [externalizeDepsPlugin()]
	},
	renderer: {
		plugins: [
			vue(),
			UnoCSS(),
			AutoImport({
				imports: [
					'vue',
					{
						'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
					}
				]
			}),
			Components({
				resolvers: [NaiveUiResolver()]
			})
		],
		css: {
			preprocessorOptions: {
				less: {
					additionalData: '@import "@renderer/assets/styles/theme.less";',
					javascriptEnabled: true
				}
			}
		},
		resolve: {
			alias: {
				'@renderer': resolve('src/renderer/src')
			}
		},
		worker: {
			format: 'es'
		},
		server: {
			port: 7777
		}
	}
})
