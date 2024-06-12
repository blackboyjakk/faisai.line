<script setup lang="ts">

import { ref } from 'vue'
import liff from '@line/liff';
import axios, { AxiosError } from 'axios';
import router from '../../router/index';

const loading = ref(true);
const isLoggedIn = ref(false);
const message = ref('');
const error = ref('');

const load = async () => {
    await lineLogin().then(() => {
        checkAuth();
    });
};

const lineLogin = async () => {
    const token = null
    await liff.init({ liffId: import.meta.env.VITE_LINE_LIFF_ID })
    if (liff.isLoggedIn()) {
        const token = await liff.getIDToken();
        if(token)
         localStorage.setItem(`LIFF_STORE:${import.meta.env.VITE_LINE_LIFF_ID}:IDToken`,token)
        loading.value = false;


        return token
    } else {
        liff.login();
    }
    return token;
}
const checkAuth = () => {

    axios.post<{ userVerify: boolean }>('auth').then((res: any) => {
        console.log(res)
        if (res.data.userVerify == true) {
            message.value = "Login successful";
            isLoggedIn.value = true;
            const redirectUri = localStorage.getItem('redirectUri');
            if (redirectUri) {
                localStorage.removeItem('redirectUri');
                setTimeout(()=>{
                    window.location.href = redirectUri;
                },1000)
            }

        } else if (res.data.userVerify == false) {

            router.push({ name: 'login' })
        } else {

            router.push({ name: 'register' })
        }

    }).catch((error: any) => {
        if (error.response) {

            error.value = "System error";
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    })
}


const logout = () => {
    liff.logout();
    liff.closeWindow();
    window.location.reload();
}

load();
</script>


<template>

    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <div class="justify-center">
                <span v-if="loading" id="loading">Loading...</span>

                <h2 style="color: green;">{{ message }}</h2>
                <h3 style="color: brown;">{{ error }}</h3>

                <a href="#" v-on:click="logout">logout</a>
            </div>
        </div>


    </div>
</template>