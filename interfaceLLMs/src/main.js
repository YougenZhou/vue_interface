import './assets/css/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios"

axios.defaults.baseURL = 'http://101.34.76.164:5000'
axios.defaults.headers['Content-Type'] = 'application/json'

const app = createApp(App)
app.use(router)
app.mount('#app')
