import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(async (to) => {
    const { getUserDetails, logUserOut } = useAuthStore();
    const { authenticated } = storeToRefs(useAuthStore());
    const token = useCookie('APP_TOKEN');

    if (token.value) {
        await getUserDetails();
        if(!authenticated.value) {
            logUserOut();
        }
    } 
});