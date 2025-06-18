<script setup>
import { useAuthStore } from '@/stores/authentication';
import { useSignupStore } from '@/stores/signup';
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router'

const authStore = useAuthStore();
const signUpStore = useSignupStore()

onMounted(() => {
  if (!authStore.listener && !authStore.loggedIn) {
    authStore.startListener();
  }
})

</script>

<template>
  <main class="flex w-full h-screen" @keyup.esc="signUpStore.reset()">
    <section class="flex w-1/2 bg-blue">
      <div class="flex items-center justify-center w-full h-full">
        <div class="flex flex-col">
          <div class="flex items-center">
            <i class="fas fa-search text-white text-2xl p-4"></i>
            <p class="text-white font-semibold text-xl">Follow your interests</p>
          </div>
          <div class="flex items-center">
            <i class="fas fa-user-friends text-white text-2xl p-4"></i>
            <p class="text-white font-semibold text-xl">Hear what people are talking about</p>
          </div>
          <div class="flex items-center">
            <i class="fas fa-comment text-white text-2xl p-4"></i>
            <p class="text-white font-semibold text-xl">Join the conversation</p>
          </div>
        </div>

      </div>
    </section>
    <section class="flex items-center justify-center w-1/2 h-full">
      <div class="flex flex-col w-1/2 font-semibold gap-5">
        <i class="fab fa-twitter text-blue text-4xl"></i>
        <p class="text-3xl mb-12">See what's happening in the world, right now!</p>
        <p>Join Twitter today.</p>
        <button @click.prevent="signUpStore.set('step1')"
          class="w-full rounded-full bg-blue font-semibold text-lg text-white p-4 hover:bg-white hover:text-blue hover:border hover:border-blue">
          Sign up
        </button>
        <RouterLink to="/login" class="w-full">
          <button
            class="w-full rounded-full border border-blue bg-white font-semibold text-lg text-blue p-4 hover:bg-blue hover:text-white ">
            Log in
          </button>
        </RouterLink>

      </div>
    </section>

    <section v-if="signUpStore.getStep !== ''"
      class="fixed w-full h-full top-0 left-0 flex items-center justify-center">
      <div class="absolute w-full h-full bg-gray-900 opacity-50" @click.prevent="signUpStore.reset()">
      </div>
      <div class="modal-main bg-white w-11/12 mx-auto rounded-lg z-3 overflow-y-auto max-h-full">
        <p>Modal</p>
      </div>
    </section>
  </main>
</template>
