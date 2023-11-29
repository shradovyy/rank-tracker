import { defineStore } from 'pinia';

export const useSerpStore = defineStore('serp', {
    state: () => ({
        keys: []
    }),
    actions: {
        async getApiKeys() {
            const { data, error } = await useFetch('/api/serp-tokens');
            if(!error.value) {
                this.keys = data.value;
            }
        },
        async addApiKey(apiKey, callback) {
            const { data, error } = await useFetch('/api/serp-tokens', {
                method: 'POST',
                body: {
                    key: apiKey
                },
                watch: false
            });
            if(error.value) {
                callback(true, error.value.data);
            } else {
                await this.getApiKeys();
                callback(false, data.value);
            }
        },
        async removeApiKey(id, callback) {
            const { data, error } = await useFetch('/api/serp-tokens', {
                method: 'DELETE',
                body: {
                    id: id
                },
                watch: false
            });
            if(error.value) {
                if(callback && typeof callback === 'function') callback(true, error.value.data);
            } else {
                await this.getApiKeys();
                if(callback && typeof callback === 'function') callback(false, data.value);
            }
        },
    },
});