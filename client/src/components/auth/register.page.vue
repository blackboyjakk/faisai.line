<script setup lang="ts">
    import { lineLogin } from '@/helper/line-auth';
import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
    import { ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    const route = useRoute()
    const router = useRouter()
    const userId = route.params.userId;
    const userEmail = ref('');
    const isLogin = ref(false)
    const init = async ()=> {
        isLogin.value= await  lineLogin()
    }
    const Register = () => {
        const body = {
            userId: userId,
            userEmail: userEmail.value
        }
        axios.post('auth/register', body, { 'Authorization': '' } as AxiosRequestConfig).then(() => {
            alert('OTP sent to your email.')
            router.push({ name: 'login' });
        }).catch((error: AxiosError<{ message: string }>) => {

            alert(error.response?.data.message);
        });
    }
init();
</script>
<template>
    <div v-if="isLogin" class="card" style="place-items: center;">
        <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" action="#" method="POST" @submit.prevent="Register">
                <div>

                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
                    <div class="mt-2">
                        <input v-model="userEmail" type="email" name="email" required
                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                    </div>
                </div>



                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                        in</button>
                </div>
            </form>


        </div>
    </div>
</template>