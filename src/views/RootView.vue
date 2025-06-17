<script setup>
import { useAuthStore } from '@/stores/authentication';
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router'

const authStore = useAuthStore();

onMounted(() => {
  if (!authStore.listener && !authStore.loggedIn) {
    authStore.startListener();
  }
})

</script>

<template>
  <div class="root">
    <h1>This is an Root page</h1>
    <h2 v-if="authStore.loggedIn === true">Hello {{ authStore.user.username }}</h2>
    <p v-if="authStore.loggedIn === false">
      Please sign in <RouterLink to="/login">here</RouterLink>
    </p>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
}
</style>
