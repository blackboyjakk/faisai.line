import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios, { type InternalAxiosRequestConfig } from 'axios'
import liff from '@line/liff'
import './helper/number-format'
import router from './router'
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
const app = createApp(App)


//in main.js
import 'primevue/resources/themes/aura-light-green/theme.css'
import '/node_modules/primeflex/primeflex.css'
import { lineLogin } from './helper/line-auth'
// import 'uno.css'


axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// Request interceptor

liff.init( { liffId: import.meta.env.VITE_LINE_LIFF_ID })

axios.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {
  
  const token = liff.getAccessToken()

  config.headers.Authorization = `Bearer ${token}`

  return Promise.resolve(config);
}, (error:any) => {
  alert(error);
})
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status == 307) {
        console.log(error.response.data)
        window.location.href = error.response.data
      }
      if (error.response.status == 401) {        
        console.log(error.response.data)
        lineLogin().then(()=>{
          window.location.reload()
        })
      }
      
    }
    return Promise.reject(error)
  },
);

app.use(PrimeVue);
app.use(ConfirmationService);
app.use(router)
app.mount('#app')
