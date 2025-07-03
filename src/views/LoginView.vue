<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from '@/stores/authentication';
import "@aws-amplify/ui-vue/styles.css";
import InputPassword from "@/components/atoms/InputPassword.vue";
import InputText from "@/components/atoms/InputText.vue";

const email = ref();
const password = ref();
const emailEl = ref(null);

const authStore = useAuthStore();

onMounted(() => {
    emailEl.value?.focus();

    if (!authStore.listener && !authStore.loggedIn) {
        authStore.startListener();
    }
})

async function handleLogin() {
    try {
        const { nextStep } = await authStore.signIn({
            email: email.value, password: password.value
        })
        console.info('nextStep', JSON.stringify(nextStep));
    } catch (err) {
        alert('Error with log in!')
        console.error('Err [handleLogin] : ' + err.message)
        await authStore.logout()
    }
}

</script>

<template>
    <form @submit.prevent="handleLogin" class="w-full flex flex-col justify-center items-center p-8 gap-4">
        <i class="fab fa-twitter text-blue text-4xl"></i>
        <p class="font-semibold text-xl">Log into Twitter</p>
        <fieldset class="w-1/3 bg-lightblue border-b-2 border-dark p-2">
            <InputText ref="emailEl" v-model="email" label="Phone, email, or username" name="email" />
        </fieldset>
        <fieldset class="w-1/3 bg-lightblue border-b-2 border-dark p-2">
            <InputPassword v-model="password" label="Enter password" />
        </fieldset>
        <button
            class="rounded-full bg-blue font-semibold text-white px-8 py-4 hover:bg-darkblue disabled:opacity-50 disabled:cursor-not-allowed">
            Log in
        </button>
    </form>
</template>
<style></style>