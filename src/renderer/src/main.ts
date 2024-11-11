import '@renderer/assets/styles/main.less'
import '@renderer/assets/styles/common.less'

import App from './App.vue'
import { createApp } from 'vue'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import 'virtual:uno.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).mount('#app')
