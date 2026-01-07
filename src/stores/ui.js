import { defineStore } from 'pinia';
import { useTwitterMyProfile } from './twitterMyProfile';
import { useNewMessage } from './newMessage';
import { useSearchUsers } from './searchUsers';

export const useUi = defineStore('ui', {
    state: () => ({
        loading: true,
        ownProfile: false,
        noProfile: false,
        loadingMessages: false,
        newMessageModal: false,
        loadingNewMessageModal: false
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
        },
        openNewMessageModal() {
            this.newMessageModal = true;
        },
        closeNewMessageModal() {
            const storeNewMessage = useNewMessage();
            const storeSearchUsers = useSearchUsers();
            this.newMessageModal = false;
            storeNewMessage.reset();
            storeSearchUsers.reset();
        },
        toggleLoadingNewMessageModal() {
            this.loadingNewMessageModal = !this.loadingNewMessageModal
        },
    },
    getters: {
    },
});