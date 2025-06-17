<script setup>
import { onMounted } from "vue";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import { formFields } from '@/services/amplify/config';
import { useAuthStore } from '@/stores/authentication';
import "@aws-amplify/ui-vue/styles.css";

const authStore = useAuthStore();
const { isPending, toSignUp, authStatus } = useAuthenticator();

onMounted(() => {
    if (!authStore.listener && !authStore.loggedIn) {
        authStore.startListener();
    }
})

async function handleSignOut() {
    await authStore.logout();
    authStore.startListener();
}

</script>

<template>
    <section>
        <authenticator :form-fields="formFields">
            <template v-if="authStatus === 'unauthenticated'" v-slot:sign-in-footer>
                <div style="text-align: center">
                    <button @click="toSignUp" class="amplify-button amplify-field-group__control" data-fullwidth="false"
                        data-size="small" type="button" style="font-weight: normal">
                        Sign Up
                    </button>
                </div>
            </template>
        </authenticator>
        <template v-if="isPending">
            <div style="text-align: center">
                <p>Loading...</p>
            </div>
        </template>
        <template v-if="authStatus === 'authenticated'">
            <h1>Hello {{ authStore.user?.username }}!</h1>
            <button @click="handleSignOut">Sign out</button>
        </template>
    </section>
</template>
<style>
@media (min-width: 1024px) {
    .login {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>