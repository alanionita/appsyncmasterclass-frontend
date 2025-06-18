import { defineStore } from 'pinia';
import * as AmplifyAuth from 'aws-amplify/auth';
import router from '@/router';

export const useSignupStore = defineStore('signup', {
    state: () => ({
        step: ''
    }),
    actions: {
        set(step) {
            this.step = step;
        },
        reset() {
            this.step = '';
        },
    },
    getters: {
        getStep({step}) {
            return step;
        }
    },
});