<script setup lang="ts">
    import { lineLogin } from '@/helper/line-auth';
import axios, { AxiosError } from 'axios';
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import liff from '@line/liff';
    const router = useRouter()

    const userOtp = ref('');
    const isLogin = ref(false)
    const init = async ()=> {
        isLogin.value= await lineLogin();
    }
    init();
    const Login = () => {
        const body = {
            userOtp: userOtp.value,
            appType: 'LINE'
        }
        console.log('body', body)
        axios.post('auth/login', body,).then(() => {
            alert('verify complete close window for back to line')
            liff.closeWindow();
            window.close();
        }).catch((error: AxiosError<{ message: string }>) => {

            alert(error.response?.data.message);
        });
    }

</script>
<template>
    <div v-if="isLogin" class="card" style="place-items: center;">
        <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" action="#" method="POST" @submit.prevent="Login">
                <div>


                    <div class="mt-2">
                        <input v-model="userOtp" type="tel" required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>



                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Verify</button>
                </div>
            </form>


        </div>
    </div>
</template>