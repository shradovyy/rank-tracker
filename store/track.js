import { defineStore } from 'pinia';

export const useTrackStore = defineStore('track', {
    state: () => ({

    }),
    actions: {
        async addKeyword(keyword, website, country, callback) {
            const { data, error } = await useFetch('/api/track/keywords', {
                method: 'POST',
                body: {
                    url: website,
                    keyword: keyword,
                    country: country
                },
                watch: false
            })

            if(error.value) {
                if(callback && typeof callback === 'function') callback(true, error.value.data);
            } else if(data.value) {
                if(callback && typeof callback === 'function') callback(false, data.value);
            }

        }
    },
});