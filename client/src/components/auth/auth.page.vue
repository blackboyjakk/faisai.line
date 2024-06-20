<script setup lang="ts">

    import { ref } from 'vue'
    import liff from '@line/liff';
    import axios, { AxiosError } from 'axios';
    import { useRoute } from 'vue-router';
    import router from '../../router/index';
import { lineLogin } from '@/helper/line-auth';
import { Param } from '@nestjs/common';

       const route = useRoute();
    const loading = ref(true);
    const isLoggedIn = ref(false);
    const message = ref('');
    const error = ref('');

    const load = async () => {
        await lineLogin().then(() => {
            checkAuth();
        });
    };

    
    const checkAuth = () => {

        axios.post<{ userVerify: boolean }>('auth').then((res: any) => {
            console.log(res)
            if (res.data.userVerify == true) {
                message.value = "Login successful";
                isLoggedIn.value = true;
                const redirectUri = localStorage.getItem('redirectUri:' + sessionStorage.tabID);
                if (redirectUri && redirectUri != import.meta.env.VITE_APP_BASE_URL + '/auth') {
                    localStorage.removeItem('redirectUri:' + sessionStorage.tabID);
                    setTimeout(() => {
                        console.log('checkAuth', redirectUri)
                        window.location.href = redirectUri;
                    }, 1000)
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