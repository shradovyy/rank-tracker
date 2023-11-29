import { defineStore } from 'pinia';

export const useModalManager = defineStore('modalManager', {
    state: () => ({
        modalManager: null
    }),
    actions: {
        setModalManager(ref) {
            this.modalManager = ref;
        }
    },
});