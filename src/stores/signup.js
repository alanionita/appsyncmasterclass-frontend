import { defineStore } from 'pinia';
import * as AmplifyAuth from 'aws-amplify/auth';
import router from '@/router';

export const useSignupStore = defineStore('signup', {
    state: () => ({
        step: ''
    }),
    actions: {
        setSignupStep(step) {
            this.step = step;
        },
    },
    getters: {
        displayModal({step}) {
            return step;
        }
    },
});