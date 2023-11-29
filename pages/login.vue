<template>
    <section class="w-full">
        <img src="/images/gradient-bg.png" class="absolute top-0 left-0 h-full md:h-auto w-full object-cover pointer-events-none -z-50">

        <div class="section flex items-center justify-center w-full">
            <div class="container-group flex justify-center items-center w-full">
                <div class="relative border border-gray-100 rounded-xl max-w-md w-full p-8 grid gap-6 shadow-xl shadow-gray-100 bg-white/25 backdrop-blur-lg">
                    <h1 class="heading text-2xl md:text-3xl">Sign In</h1>
                    <form action="" @submit.prevent="login" method="post" class="grid gap-2">
                        <Input v-model="user.email" label="email" type="text" name="Email" :error="errors.email" placeholder="Email address"/>
                        <Input v-model="user.password" label="password" type="password"  :error="errors.password" name="Password" placeholder="Password"/>
                        <button type="submit" class="button-blue mt-2" :disabled="loading">Submit</button>
                    </form>
                    <div class="flex justify-center items-center flex-wrap gap-2">
                        <span class="paragraph text-base">Don't have an account yet?</span>
                        <nuxt-link to="/signup" class="text-theme-blue font-semibold">Sign Up</nuxt-link>
                    </div>
                    <div class="bg-white/50 absolute top-0 left-0 w-full h-full flex items-center justify-center" v-if="loading">
                        <Loader/>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import Input from '~/components/Input.vue';
import Loader from '~/components/Loader.vue';

import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'
import { useModalManager } from '~/store/modalManager';

definePageMeta({
    middleware: 'guest',
    layout: 'default-full'
})

useSeoMeta({
    title: 'Sign In - Rank Tracker by Stanislav Hradovyy - JSguy.dev',
    ogTitle: 'Sign In - Rank Tracker by Stanislav Hradovyy - JSguy.dev',
})

const { authenticateUser } = useAuthStore();
const { authenticated, user: userInfo } = storeToRefs(useAuthStore());
const { modalManager } = storeToRefs(useModalManager());


const user = ref({
  email: '', 
  password: '',
});

const errors = ref({});
const loading = ref(false)
const router = useRouter();

const login = async () => {
    errors.value = {};
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await authenticateUser(user.value, (err, body) => {
        if(err) {
            if(body.errors) errors.value = body.errors;
            else modalManager.value.showAlert(body.message || 'Something went wrong. Please, try again!')
            return;
        }
        if(authenticated) {
            router.push('/app');
        }
    });
    loading.value = false;
};
</script>

<style lang="scss" scoped>

</style>