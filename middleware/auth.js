import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware((to) => {

    const { authenticated, user } = storeToRefs(useAuthStore()); // make authenticated state reactive
    const token = useCookie('APP_TOKEN'); // get token from cookies

    if(!authenticated.value || !user.value) {
        abortNavigation();
        return navigateTo('/login');
    }

});