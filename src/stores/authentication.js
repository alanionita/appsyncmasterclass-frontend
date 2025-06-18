import { defineStore } from 'pinia';
import * as AmplifyAuth from 'aws-amplify/auth';
import router from '@/router';
import { startAuthListener } from '@/services/amplify/hub';

export const useAuthStore = defineStore('authentication', {
    state: () => ({
        loggedIn: false,
        user: undefined,
        listener: null,
    }),
    actions: {
        login(user) {
            this.loggedIn = true
            if (user) {
                this.user = user
            }
        },
        async logout() {
            await AmplifyAuth.signOut({ global: true });
            this.loggedIn = false;
            this.user = undefined
            router.push('/')
        },

        async signUp(userData) {
            try {
                const { email, name, password, phone, birthdate } = userData;

                if (!email || !name || !password || !phone || !birthdate) {
                    throw Error('Invalid user data')
                }

                const { isSignUpComplete, userId, nextStep } = await AmplifyAuth.signUp({
                    username: email,
                    password,
                    options: {
                        userAttributes: {
                            email,
                            name,
                            phone_number: phone,
                            birthdate
                        },
                    }
                })
                return {
                    isSignUpComplete, userId, nextStep
                }
            } catch (err) {
                console.error('Err [auth.signUp] :', err.message)
                return err;
            }
        },
        startListener() {
            this.listener = startAuthListener();
        },
        stopListener() {
            if (this.listener && typeof this.listener === 'function') {
                this.listener();
                this.listener = null
            }
        }
    },
    getters: {
        username({ user }) {
            return user && user.username && user.username
        },
    },
});