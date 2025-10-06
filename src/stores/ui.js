import { defineStore } from 'pinia';

export const useUi = defineStore('ui', {
    state: () => ({
        loading: true,
    }),
    actions: {
        loadingOff() {
            this.loading = false;
        },
        loadingOn() {
            this.loading = true;
        }
    },
    getters: {
    },
});