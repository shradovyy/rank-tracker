import { defineStore } from 'pinia';
import moment from 'moment';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authenticated: false,
        loading: false,
        user: null,
        lastUserRead: null
    }),
    actions: {
        async getUserDetails(forced = false) {

            if(this.user && this.lastUserRead && !forced) {
                let diff = moment().diff(moment(this.lastUserRead), 'minutes');
                if(diff < 5) return;
            }

            const { data, pending, error } = await useFetch('/api/auth/user');
            if(!error.value && data.value) {
                this.user = data.value;
                this.authenticated = true;
                this.lastUserRead = moment().toDate();
            }
        },
        async registerUser(body, callback) {

            const { data, pending, error } = await useFetch('/api/auth/register', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: body,
                watch: false
            });

            if(error.value) return callback(true, error.value.data);
            if(!data.value) return callback(true, { message: 'Something went wrong!' });
            return callback(false, data.value);
        },
        async authenticateUser(body, callback) {

            const { data, pending, error } = await useFetch('/api/auth/login', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: body,
                watch: false
            });

            this.loading = pending;

            if(error.value) return callback(true, error.value.data);
            if(!data.value) return callback(true, { message: 'Something went wrong!' });

            const token = useCookie('APP_TOKEN');
            token.value = data.value.token;
            this.authenticated = true;
            this.user = data.value;

            return callback(false, data.value);
        },
        logUserOut() {
            const token = useCookie('APP_TOKEN'); // useCookie new hook in nuxt 3
            this.authenticated = false; // set authenticated  state value to false
            token.value = null; // clear the token cookie
            this.user = null;
        },
    },
});