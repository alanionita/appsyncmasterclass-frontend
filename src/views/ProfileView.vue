<script setup>
import { onMounted, onUpdated, ref } from 'vue';
import { useAuthStore } from '@/stores/authentication';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useTwitterTheirProfile } from '@/stores/twitterTheirProfile';
import Profile from '@/components/templates/Profile.vue';
import { useTwitterTimeline } from '@/stores/twitterTimeline';
import { vScrollend } from '@/directives';

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
  try {
    if (!myProfile.isSelf(screenName)) {
      isMine.value = false;
      await theirProfile.setProfile(screenName)
      await timeline.getTweets(theirProfile.id)
      await theirProfile.refreshBgImgUrl()
      await theirProfile.refreshImgUrl()
      await theirProfile.getFollowers()
      await theirProfile.getFollowing()
    } else {
      isMine.value = true;
      await timeline.getMyTimeline()
      await myProfile.refreshBgImgUrl()
      await myProfile.refreshImgUrl()
      await myProfile.getFollowers()
      await myProfile.getFollowing()
    }
  } catch (err) {
    console.error('Err [ProfileView/updatePageData] ::', err.message)
    console.info(JSON.stringify(err))
    return
  }
}

async function loadMoreTweets() {
  try {
    if (timeline.nextToken) {
      if (!myProfile.isSelf(route.params.screenName)) {
        await timeline.getTweets(theirProfile.id, 10, timeline.nextToken)
      } else {
        await timeline.getMyTimeline(10, timeline.nextToken)
      }
    }
  } catch (err) {
    console.error('Err [ProfileView/loadMoreTweets] ::', err.message)
    console.info(JSON.stringify(err))
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
      <div class="overflow-y-auto" v-scrollend:bottom="loadMoreTweets">
        <Profile :my-profile="isMine" :profile="isMine ? myProfile : theirProfile" :tweets="timeline.tweets"/>
      </div>
    </template>
  </ThreeColTemplate>
</template>