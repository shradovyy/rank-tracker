<template>
    <section class="w-full">
        <img src="/images/gradient-bg.png" class="absolute top-0 left-0 h-full md:h-auto w-full object-cover pointer-events-none -z-50">
        
        <div class="section flex items-center justify-center w-full">
            <div class="container-group flex justify-center items-center w-full">

                <div class="relative border border-gray-100 rounded-xl max-w-md w-full p-8 grid gap-6 shadow-xl shadow-gray-100">
                    <h1 class="heading text-2xl md:text-3xl">Sign up</h1>
                    <form action="" @submit.prevent="handleSubmit" method="post" class="grid gap-2">
                        <Input v-model="user.email" label="email" type="text" name="Email" :error="errors.email" placeholder="Email address"/>
                        <Input v-model="user.password" label="password" type="password"  :error="errors.password" name="Password" placeholder="Password"/>
                        <Input v-model="user.passwordRepeat" label="password" type="password"  :error="errors.passwordRepeat" name="Password" placeholder="Password"/>
                        <button type="submit" class="button-blue mt-2" :disabled="loading">Submit</button>
                    </form>
                    <div class="flex justify-center items-center flex-wrap gap-2">
                        <span class="paragraph text-base">Already have an account?</span>
                        <nuxt-link to="/login" class="text-theme-blue font-semibold">Sign In</nuxt-link>
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
    title: 'Sign Up - Rank Tracker by Stanislav Hradovyy - JSguy.dev',
    ogTitle: 'Sign Up - Rank Tracker by Stanislav Hradovyy - JSguy.dev',
})

const { registerUser } = useAuthStore();
const { modalManager } = storeToRefs(useModalManager());

const user = ref({
  email: '', 
  password: '',
  passwordRepeat: '',
});

const errors = ref({});
const loading = ref(false)
const router = useRouter();

const handleSubmit = async () => {
    errors.value = {};
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    await registerUser(user.value, (err, body) => {

        if(err) {
            if(body.errors) errors.value = body.errors;
            else modalManager.value.showAlert(body.message || 'Something went wrong. Please, try again!')
            return;
        }

        modalManager.value.showAlert(`You have successfully created an account. You can now sign in.`)
        router.push('/login');
    });
    loading.value = false;
};
</script>

<style lang="scss" scoped>

</style>