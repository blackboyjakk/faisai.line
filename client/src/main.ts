import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axios, { type InternalAxiosRequestConfig } from 'axios'
import liff from '@line/liff'
import './helper/number-format'
import router from './router'
import PrimeVue from 'primevue/config';
const app = createApp(App)


//in main.js
import 'primevue/resources/themes/aura-light-green/theme.css'
// import 'uno.css'


axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// Request interceptor
axios.interceptors.request.use(async (config: InternalAxiosRequestConfig<any>) => {

  const token = localStorage.getItem(`LIFF_STORE:${import.meta.env.VITE_LINE_LIFF_ID}:IDToken`)
  config.headers.Authorization = `Bearer ${token}`

  return Promise.resolve(config);
}, () => {
  alert('Error');
})
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status == 307) {
        console.log(error.response.data)
        window.location.href = error.response.data
      }
      if (error.response.status === 401) {
        liff.logout();
            localStorage.setItem('redirectUri', window.location.href)
            setTimeout(()=>{

            liff.login();
            },1000)
        
      }
    }
    return Promise.reject(error)
  },
);

app.use(PrimeVue);
app.use(router)
app.mount('#app')
