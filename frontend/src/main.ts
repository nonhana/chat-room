import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { useAuthStore } from './stores/auth'
import { initializeAuthCleanup } from './utils/tab-auth-cleanup'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize tab-based authentication and cleanup before mounting
const authStore = useAuthStore()
authStore.init()

// Initialize cleanup system
initializeAuthCleanup()

app.mount('#app')
