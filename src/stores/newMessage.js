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
        selectUser({ id, screenName, imgUrl, name }) {
            const userPresent = this.selectedUserExists(id)
            if (!userPresent) {
                this.selectedUsers.set(id, { screenName, imgUrl, id, name })
            }
        },
        removeUser({ id }) {
            this.selectedUsers.delete(id)
        },
    },
    getters: {
        asArray: state => Array.from(state.selectedUsers, ([_, values]) => ({ ...values }))
    }
});