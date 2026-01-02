import { defineStore } from 'pinia';
import { useTwitterMyProfile } from './twitterMyProfile';

export const useUi = defineStore('ui', {
    state: () => ({
        loading: true,
        ownProfile: false,
        noProfile: false,
        loadingMessages: false,
    }),
    actions: {
        loadingOff() {
            this.loading = false;
        },
        loadingOn() {
            this.loading = true;
        },
        setOwnProfile(screenName) {
            const myProfile = useTwitterMyProfile();

            this.ownProfile = myProfile.screenName == screenName;
        },
        toggleNoProfile() {
            this.noProfile = !this.noProfile
        },
        reset() {
            this.noProfile = false
        },
        toggleLoadingMessages() {
            this.loadingMessages = !this.loadingMessages
        }
    },
    getters: {
    },
});