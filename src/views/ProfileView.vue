<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authentication';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useTwitterTheirProfile } from '@/stores/twitterTheirProfile';
import Profile from '@/components/templates/Profile.vue';
import { useTwitterTimeline } from '@/stores/twitterTimeline';

const path = ref(window.location.pathname)
const isMine = ref(false);
const route = useRoute();

const myProfile = useTwitterMyProfile()
const theirProfile = useTwitterTheirProfile()
const timeline = useTwitterTimeline()

async function loginUserIfAlreadyAuthenticated() {
  const authStore = useAuthStore();
  await authStore.verifyAuth(path);
}

async function updatePageData(screenName = null) {
  if (!myProfile.isSelf(screenName)) {
    isMine.value = false;
    await theirProfile.setProfile(screenName)
    await timeline.getTweets(theirProfile.id)
  } else {
    isMine.value = true;
    await timeline.getMyTimeline()
  }
}

onMounted(async () => {
  await loginUserIfAlreadyAuthenticated()
  await updatePageData(route.params.screenName)
})

onBeforeRouteUpdate(async (to, from) => {
  await updatePageData(to.params.screenName)
})

</script>

<template>
  <ThreeColTemplate :trending="true" :follow-who="true">
    <template #middle>
      <Profile :my-profile="isMine" :profile="isMine ? myProfile : theirProfile" :tweets="timeline.tweets"/>
    </template>
  </ThreeColTemplate>
</template>