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
      <div class="flex h-full flex-col overflow-y-auto gap-4">
        <section class="border-b border-lighter flex items-center justify-between py-4">
          <h1 class="text-2xl font-semibold">Profile</h1>
          <i class="far fa-star text-xl text-blue"></i>
        </section>
      </div>
    </template>
  </ThreeColTemplate>
</template>