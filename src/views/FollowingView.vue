<script setup>
import FollowList from '@/components/organisms/FollowList.vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { useTwitterTheirProfile } from '@/stores/twitterTheirProfile';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { useUi } from '@/stores/ui';
import { debounce } from '@/utils/timing';

const route = useRoute()

const myProfile = useTwitterMyProfile()
const theirProfile = useTwitterTheirProfile()
const ui = useUi();
const { loadingOn, loadingOff } = useUi()

async function updatePageData(screenName = null) {
    loadingOn()
    if (!ui.ownProfile) {
        await theirProfile.setProfile(screenName)
        await theirProfile.getFollowers()
        await theirProfile.getFollowing()
    } else {
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
            <FollowList v-if="ui.ownProfile"
                :profile="myProfile" 
                :profile-name="myProfile.name"
                :profile-screen-name="myProfile.screenName"
                :list="myProfile.following"/>
            <FollowList v-if="!ui.ownProfile"
                :profile="theirProfile" 
                :profile-name="theirProfile.name"
                :profile-screen-name="theirProfile.screenName"
                :list="theirProfile.following"/>
        </template>
    </ThreeColTemplate>
</template>