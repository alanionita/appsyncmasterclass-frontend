<script setup>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authentication';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useTwitterTheirProfile } from '@/stores/twitterTheirProfile';
import Profile from '@/components/templates/Profile.vue';
import { useTwitterTimeline } from '@/stores/twitterTimeline';
import { vScrollend } from '@/directives';
import { debounce } from '@/utils/timing';
import { useUi } from '@/stores/ui';
import { storeToRefs } from 'pinia';

const path = ref(window.location.pathname)
const route = useRoute();

const myProfile = useTwitterMyProfile()
const theirProfile = useTwitterTheirProfile()
const timeline = useTwitterTimeline();
const { tweets } = storeToRefs(timeline)
const uiStore = useUi()

const isMine = ref(myProfile.isSelf(route.params.screenName));

async function loginUserIfAlreadyAuthenticated() {
  const authStore = useAuthStore();
  await authStore.verifyAuth(path);
}

async function updatePageData(screenName = null) {
  try {
    timeline.$reset();
    uiStore.loadingOn()
    if (isMine.value) {
      // My profile
      await myProfile.refreshBgImgUrl()
      await myProfile.refreshImgUrl()
      await myProfile.getFollowers()
      await myProfile.getFollowing()
      await timeline.getMyTimeline()
      debounce(uiStore.loadingOff())
      return
    }
    // Their profile
    await theirProfile.setProfile(screenName)
    await theirProfile.refreshBgImgUrl()
    await theirProfile.refreshImgUrl()
    await theirProfile.getFollowers()
    await theirProfile.getFollowing()
    await timeline.getTweets(theirProfile.id)
    debounce(uiStore.loadingOff())
    return
  } catch (err) {
    console.error('Err [ProfileView/updatePageData] ::', err.message)
    console.info(JSON.stringify(err))
    return
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
  <ThreeColTemplate :trending="true" :follow-who="true" v-scrollend:bottom="loadMoreTweets">
    <template #middle v-scrollend:bottom="loadMoreTweets">
      <div class="overflow-y-auto" v-scrollend:bottom="() => timeline.loadMoreTweets(isMine)">
        <Profile :my-profile="isMine" :profile="isMine ? myProfile : theirProfile" :tweets="tweets" />
      </div>
    </template>
  </ThreeColTemplate>
</template>