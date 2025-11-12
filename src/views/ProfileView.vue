<script setup>
import { onMounted } from 'vue';
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

const myProfile = useTwitterMyProfile()
const theirProfile = useTwitterTheirProfile()
const timeline = useTwitterTimeline();
const { tweets } = storeToRefs(timeline)
const uiStore = useUi()
const route = useRoute();

async function updateMyProfile() {
  try {
    await myProfile.refreshBgImgUrl()
    await myProfile.refreshImgUrl()
    await myProfile.getFollowers()
    await myProfile.getFollowing()
    await timeline.getMyTimeline()
  } catch (err) {
    console.error('Err [ProfileView/updateMyProfile] ::', err.message)
    console.info(JSON.stringify(err))
    return
  }
}

async function updateTheirProfile(screenName) {
  try {
    
    const profile = await theirProfile.setProfile(screenName);
    if (profile === null) {
      return;
    }
    await theirProfile.refreshBgImgUrl()
    await theirProfile.refreshImgUrl()
    await theirProfile.getFollowers()
    await theirProfile.getFollowing()
    await timeline.getTweets(theirProfile.id)
  } catch (err) {
    console.error('Err [ProfileView/updateTheirProfile] ::', err.message)
    console.info(JSON.stringify(err))
    return
  }
}

async function updatePageData(screenName) {
  try {
    timeline.$reset();
    uiStore.loadingOn();
    if (uiStore.ownProfile) {
      await updateMyProfile();
      debounce(uiStore.loadingOff())
      return
    }
    await updateTheirProfile(screenName)
    debounce(uiStore.loadingOff())
    return
  } catch (err) {
    console.error('Err [ProfileView/updatePageData] ::', err.message)
    console.info(JSON.stringify(err))
    return
  }
}

onMounted(async () => {
  await updatePageData(route.params.screenName)
})

onBeforeRouteUpdate(async (to, from) => {
  await updatePageData(to.params.screenName)
})

</script>

<template>
  <ThreeColTemplate :trending="true" :follow-who="true" :search="true">
    <template #middle>
      <div class="overflow-y-auto" v-scrollend:bottom="() => timeline.loadMoreTweets(uiStore.ownProfile)">
        <Profile :profile="uiStore.ownProfile ? myProfile : theirProfile" :tweets="tweets" />
      </div>
    </template>
  </ThreeColTemplate>
</template>