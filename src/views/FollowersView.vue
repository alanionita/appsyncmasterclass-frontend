<script setup>
import FollowList from '@/components/organisms/FollowList.vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authentication';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { useTwitterTheirProfile } from '@/stores/twitterTheirProfile';
import { useTwitterTimeline } from '@/stores/twitterTimeline';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { useUi } from '@/stores/ui';
import { debounce } from '@/utils/timing';

const route = useRoute()

const myProfile = useTwitterMyProfile()
const theirProfile = useTwitterTheirProfile()
// const timeline = useTwitterTimeline()
const ui = useUi()
const {loadingOn, loadingOff} = useUi()

async function updatePageData(screenName = null) {
    loadingOn()
    if (!ui.ownProfile) {
        await theirProfile.setProfile(screenName)
        // await timeline.getTweets(theirProfile.id)
        await theirProfile.getFollowers()
        await theirProfile.getFollowing()
    } else {
        // await timeline.getMyTimeline()
        await myProfile.getFollowers()
        await myProfile.getFollowing()
    }
    debounce(loadingOff())
}

onMounted(async () => {
    await updatePageData(route.params.screenName)
})

onBeforeRouteUpdate(async (to, from) => {
    await updatePageData(to.params.screenName)
})

</script>
<template>
    <ThreeColTemplate>
        <template #middle>
            <FollowList :profile="ui.ownProfile ? myProfile : theirProfile"
                :profile-name="ui.ownProfile ? myProfile.name : theirProfile.name"
                :profile-screen-name="ui.ownProfile ? myProfile.screenName : theirProfile.screenName"
                :list="ui.ownProfile ? myProfile.followers : theirProfile.followers" />
        </template>
    </ThreeColTemplate>
</template>