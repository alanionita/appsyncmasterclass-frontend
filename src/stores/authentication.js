import { defineStore } from 'pinia';
import * as AmplifyAuth from 'aws-amplify/auth';
import router from '@/router';
import { startAuthListener } from '@/services/amplify/hub';
import { useTwitterStore } from './twitter';

export const useAuthStore = defineStore('authentication', {
    state: () => ({
        loggedIn: false,
        user: undefined,
        listener: null,
    }),
    actions: {
        setState(user) {
            this.loggedIn = true
            if (user) {
                this.user = user
            }
        },
        resetState() {
            this.loggedIn = false;
            this.user = undefined;
        },
        async verifyAuth(path = null) {
            const twitterStore = useTwitterStore();
            try {
                const user = await AmplifyAuth.getCurrentUser();
                if (user) {
                    this.setState(user);
                    await twitterStore.setProfile();
                    !path && router.push('/home');
                    this.listener && this.stopListener();
                } else {
                    this.resetState();
                }
            } catch (err) {
                console.error('Err [store/auth.verifyAuth()] :', err.message);
                throw err;
            }
        },
        async logout() {
            await AmplifyAuth.signOut({ global: true });
            this.resetState();
            router.push('/');
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
        async completeSignUp(userData) {
            try {
                const { email, verificationCode, password } = userData;

                if (!email || verificationCode || !password) {
                    throw Error('Invalid user data')
                }

                let complete;
                let step;

                // TODO: this logic might be able to move into the Amplify Hub listener
                const { isSignUpComplete, nextStep } = await AmplifyAuth.confirmSignUp({
                    username: email,
                    confirmationCode: verificationCode
                })

                complete = isSignUpComplete;
                step = nextStep

                if (isSignUpComplete) {
                    const signInResp = await AmplifyAuth.signIn({
                        username: email,
                        password,
                    })
                    if (signInResp.nextStep === 'DONE') {
                        complete = true;
                    }
                    step = signInResp.nextStep;
                }

                return {
                    isSignUpComplete: complete,
                    nextStep: step
                }
            } catch (err) {
                console.error('Err [auth.completeSignUp] :', err.message)
                return err;
            }
        },

        async signIn(userData) {
            const twitterStore = useTwitterStore();
            try {
                const { email, password } = userData;
                if (!email || !password) {
                    throw Error('Invalid user data')
                }

                const { nextStep } = await AmplifyAuth.signIn({
                    username: email,
                    password,
                })

                await twitterStore.setProfile();

                return {
                    nextStep
                }
            } catch (err) {
                console.error('Err [auth.signIn] :', err.message)
                throw err;
            }
        },
        async resendVerificationCode(email) {
            try {
                if (!email) {
                    throw Error('Invalid user data')
                }

                const { destination, deliveryMedium } = await AmplifyAuth.resendSignUpCode({
                    username: email,
                })
                return { destination, deliveryMedium }

            } catch (err) {
                console.error('Err [auth.resendVerificationCode] :', err.message)
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