// main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/custom.css'

// Tạo admin nếu chưa có
import { createAdminAccount } from './create-admin'
createAdminAccount();

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')