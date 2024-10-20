import '@/assets/styles/main.less'
import '@/assets/styles/common.less'


import App from './App.vue'
import { createApp } from 'vue'
import router from './router'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'
import '@unocss/reset/tailwind-compat.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).mount('#app')
