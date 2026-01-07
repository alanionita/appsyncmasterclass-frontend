import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useNewMessage = defineStore('newMessage', {
    state: () => ({
        selectedUsers: reactive(new Map())
    }),
    actions: {
        reset() {
            this.selectedUsers = reactive(new Map())
        },
        selectedUserExists(id) {
            return this.selectedUsers.has(id)
        },
        selectUser({ id, screenName, imgUrl }) {
            const userPresent = this.selectedUserExists(id)
            if (!userPresent) {
                this.selectedUsers.set(id, { screenName, imgUrl, id })
            }
        },
        removeUser({ id }) {
            this.selectedUsers.delete(id)
        },
    },
    getters: {
    }
});