<template>
    <header class="w-full flex-none text-sm font-semibold leading-6 relative z-20">

        <div class="relative z-10">
            <nav aria-label="Global" class="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
                <div class="relative flex items-center py-[2.125rem]">

                    <nuxt-link class="flex-none" to="/">
                        <span class="sr-only">jsguy.dev</span>
                        <img src="/images/logo.png" width="200" height="67" alt="Logo">
                    </nuxt-link>
                    
                    <div class="ml-auto hidden lg:flex lg:items-center" v-if="authenticated && user">
                        <nuxt-link to="/app" class="ml-8 hover:text-theme-blue transition duration-300">App</nuxt-link>
                        <a href="/" class="ml-8 hover:text-theme-blue transition duration-300" @click.prevent="logout">Log out</a>
                    </div>
                    <div class="ml-auto hidden lg:flex lg:items-center" v-else>
                        <nuxt-link to="/login" class="button-blue flex items-center justify-center">Sign In</nuxt-link>
                    </div>

                    <button type="button" class="ml-auto flex h-8 w-8 items-center justify-center lg:hidden" @click="menuShown = !menuShown">
                        <span class="sr-only">Open navigation</span>
                        <svg viewBox="0 0 24 24" class="h-6 w-6 stroke-slate-800"><path d="M3.75 12h16.5M3.75 6.75h16.5M3.75 17.25h16.5" fill="none" stroke-width="1.5" stroke-linecap="round"></path></svg>
                    </button>

                </div>
            </nav>
        </div>


        <Transition>
            <div class="lg:hidden bg-black/15 backdrop-blur-sm  fixed top-0 left-0 w-full h-screen z-40" v-if="menuShown" @click="menuShown = false"></div>
        </Transition>

        <Transition name="slide-fade">
            <nav class="fixed top-0 right-0 z-50 bottom-0 ml-auto w-full bg-white max-w-xs shadow-lg overflow-y-auto border-l border-gray-100" v-if="menuShown">
                <div class="px-8 py-6 flex items-center justify-between">
                    <nuxt-link class="" to="/" @click="hideMenu">
                        <span class="sr-only">99Freight</span>
                        <img src="/images/logo.png" alt="Logo" width="100">
                    </nuxt-link>
                    <button class="w-8 h-8 text-xl text-slate-800" @click="hideMenu">
                        <span><fa :icon="{ prefix: 'fas', iconName: 'xmark' }"/></span>
                    </button>
                </div>

                <div class="grid gap-2 px-8 border-t border-b border-gray-100 py-8">
                    <nuxt-link to="/app" class="flex items-center py-2 font-semibold text-base text-gray-700" @click="hideMenu">App</nuxt-link>
                    <a href="/" class="flex items-center py-2 font-semibold text-base text-gray-700" @click.prevent="logout">Log out</a>
                </div>

            </nav>
        </Transition>


    </header>
</template>

<script setup>
import { useAuthStore } from '~/store/auth';

const { logUserOut } = useAuthStore();
const { authenticated, user } = storeToRefs(useAuthStore());

const menuShown = ref(false);

watch(menuShown, () => {
    document.body.classList.toggle('overflow-hidden');
});

const hideMenu = () => {
    menuShown.value = false;
}

const logout = () => {
    hideMenu();
    logUserOut();
    navigateTo('/login');
}


</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}


.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>