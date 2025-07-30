<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authentication';
import Timeline from '@/components/molecules/Timeline.vue';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';

const path = ref(window.location.pathname)

async function loginUserIfAlreadyAuthenticated() {
  const authStore = useAuthStore();
  await authStore.verifyAuth(path);
}

onMounted(() => loginUserIfAlreadyAuthenticated())

</script>

<template>
  <ThreeColTemplate>
    <template #middle>
      <h1>Profile</h1>
    </template>
  </ThreeColTemplate>
</template>