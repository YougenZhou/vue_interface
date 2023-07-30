import './assets/css/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios"

axios.defaults.baseURL = 'http://localhost:994/webapi/'
axios.defaults.headers['Content-Type'] = 'application/json'

const app = createApp(App)
app.use(router)
app.mount('#app')
