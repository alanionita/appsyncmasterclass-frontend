<script setup>
import FollowList from '@/components/organisms/FollowList.vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authentication';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { useTwitterTheirProfile } from '@/stores/twitterTheirProfile';
import { useTwitterTimeline } from '@/stores/twitterTimeline';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';

const path = ref(window.location.pathname)
const route = useRoute()

const myProfile = useTwitterMyProfile()
const theirProfile = useTwitterTheirProfile()
const timeline = useTwitterTimeline()
const isMine = ref(false);

async function loginUserIfAlreadyAuthenticated() {

    const authStore = useAuthStore();
    await authStore.verifyAuth(path);
}

async function updatePageData(screenName = null) {
    if (!myProfile.isSelf(screenName)) {
        isMine.value = false;
        await theirProfile.setProfile(screenName)
        await timeline.getTweets(theirProfile.id)
        await theirProfile.getFollowers()
        await theirProfile.getFollowing()
    } else {
        isMine.value = true;
        await timeline.getMyTimeline()
        await myProfile.getFollowers()
        await myProfile.getFollowing()
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
    <ThreeColTemplate>
        <template #middle>
            <FollowList :profile="isMine ? myProfile : theirProfile"
                :profile-name="isMine ? myProfile.name : theirProfile.name"
                :profile-screen-name="isMine ? myProfile.screenName : theirProfile.screenName"
                :list="isMine ? myProfile.followers : theirProfile.followers" />
        </template>
    </ThreeColTemplate>
</template>