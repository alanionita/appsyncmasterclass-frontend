import { defineStore } from 'pinia';

export const useAuthStore = defineStore('authentication', {
  state: () => ({
    loggedIn: false,
    user: undefined,
  }),
  // Optional: Add actions/getters here
  actions: {
    updateUser(payload) {
      this.user = payload; // Mutate state directly
    }
  }
});