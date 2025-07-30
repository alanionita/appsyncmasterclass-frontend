<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authentication';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useTwitterTheirProfile } from '@/stores/twitterTheirProfile';
import ProfileMy from '@/components/templates/ProfileMy.vue';
import ProfileTheir from '@/components/templates/ProfileTheir.vue';

const path = ref(window.location.pathname)
const isMine = ref(false);

const myProfile = useTwitterMyProfile()
const theirProfile = useTwitterTheirProfile()
const route = useRoute()

async function loginUserIfAlreadyAuthenticated(screenName) {
  const authStore = useAuthStore();
  await authStore.verifyAuth(path);
  if (!myProfile.isSelf(screenName)) {
    isMine.value = false;
    await theirProfile.setProfile(screenName)
  } else {
    isMine.value = true;
  }
}

onMounted(() => loginUserIfAlreadyAuthenticated(route.params.screenName))

onBeforeRouteUpdate((to, from) => {
  loginUserIfAlreadyAuthenticated(to.params.screenName)
})

</script>

<template>
  <ThreeColTemplate>
    <template #middle>
      <ProfileMy v-if="isMine" />
      <ProfileTheir v-if="!isMine" />
    </template>
  </ThreeColTemplate>
</template>