import { reactive } from 'vue'

export const store = reactive({
    profile: null,
    error: null,
    pending: false,
    setProfile (newProfile) {
        if (newProfile && !this.profile) {
            this.profile = newProfile
        }
    },
    setError (newErr) {
        if (newErr) {
            this.error = newErr
        }
    },
    clearError () {
        this.error = null;
    },
    togglePending () {
        this.pending = !this.pending
    }
})