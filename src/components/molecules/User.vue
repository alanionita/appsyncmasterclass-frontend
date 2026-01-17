<script setup>
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { onMounted, ref } from 'vue';
import * as S3Urls from '@/services/s3/urls';
import { generateHtmlLinks } from '@/utils/urls';
import { useAppsync } from '@/stores/appsync';

const { user } = defineProps(['user'])
const followingLabel = ref('Following');
const userBioEl = ref(null);
const userBioElHtml = ref(null);
const userFollowing = ref(false);
const userImgUrl = ref('default_profile.png');

const profile = useTwitterMyProfile();
const { appsyncClient } = useAppsync();

async function handleImageError(event) {
    try {
        userImgUrl.value = await S3Urls.refreshSignedUrl(event.target.currentSrc)
    } catch (err) {
        console.error('Err [twitterMyProfile/fetchSignedUrl] ::', err.message)
        console.info(JSON.stringify(err))
        return
    }
}

async function followUser(id) {
    try {
        const res = await appsyncClient.follow({ userId: id })
        if (res) {
            userFollowing.value = true
        }
    } catch (err) {
        console.error('Err [User/followUser()', err.message)
    }
}

async function unfollowUser(id) {
    try {
        const res = await appsyncClient.unfollow({ userId: id })
        if (res) {
            userFollowing.value = false
        }
    } catch (err) {
        console.error('Err [User/unfollowUser()', err.message)
    }
}

onMounted(() => {
    if (user.bio && user.bio.length > 0) {
        const userBioHtml = generateHtmlLinks(user.bio)
        userBioElHtml.value = userBioHtml
    }
    if (user.following) {
        userFollowing.value = user.following
    }
    if (user.imgUrl) {
        userImgUrl.value = user.imgUrl.length > 0 && user.imgUrl
    }
})

</script>

<template>
    <li class="grid grid-cols-8 grid-rows-1 w-full p-4 gap-2 border-b border-lighter hover:bg-lightest">
        <a :href="`/${user.screenName}`" class="col-start-0 col-span-3 md:col-span-1 self-center">
            <img :src="`${userImgUrl}`" @error="handleImageError" class="size-12 rounded-full" />
        </a>
        <section class="col-start-4 md:col-start-2 col-span-4 md:col-span-8">
            <a id="custom-link" :href="`/${user.screenName}`" class="">
                <p class="font-bold">{{ user.name }}</p>
                <p class="text-dark text-sm sm:truncate">@{{ user.screenName }}</p>
            </a>
            <p ref="userBioEl" class="w-auto" v-html="userBioElHtml"></p>
        </section>
        <div class="col-start-11 col-span-3 self-center" v-if="profile.id !== user.id">
            <button v-if="!userFollowing" @click="followUser(user.id)"
                class="text-blue font-bold px-4 py-2 rounded-full border border-blue hover:bg-lightblue">
                Follow
            </button>
            <button v-if="userFollowing" @mouseover="followingLabel = 'Unfollow'"
                @mouseleave="followingLabel = 'Following'" @click="unfollowUser(user.id)"
                class="text-white bg-blue font-bold px-4 py-2 rounded-full border hover:bg-red-700 hover:cursor-pointer">
                {{ followingLabel }}
            </button>
        </div>
    </li>
</template>