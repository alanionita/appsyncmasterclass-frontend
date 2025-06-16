import { defineStore } from 'pinia';
import AmplifyAuth from 'aws-amplify/auth';
import router from '@/router';

export const useAuthStore = defineStore('authentication', {
    state: () => ({
        loggedIn: false,
        user: undefined,
    }),
    actions: {
        login(user) {
            this.user = user
        },
        async logout() {
            await AmplifyAuth.signOut({ global: true });
            this.loggedIn = false;
            this.user = undefined
            router.push('/')
        }
    },
    getters: {
        loggedIn(state) {
            return state.loggedIn
        },
        user(state) {
            return state.user
        }
    },
});