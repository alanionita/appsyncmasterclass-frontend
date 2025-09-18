<script setup>
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { ref } from 'vue';
import * as S3Urls from '@/services/s3/urls';

const { user } = defineProps(['user'])
const followingLabel = ref('Following');

const profile = useTwitterMyProfile();

async function handleImageError(url) {
    try {
        user.imgUrl = await S3Urls.refreshSignedUrl(url)
    } catch (err) {
        console.error('Err [twitterMyProfile/fetchSignedUrl] ::', err.message)
        console.info(JSON.stringify(err))
        return
    }
}

</script>

<template>
    <li class="grid grid-cols-12 grid-rows-1 w-full p-4 gap-2 border-b border-lighter hover:bg-lightest">
        <a :href="`/${user.screenName}`" class="col-start-1 col-span-1 self-center">
            <img :src="`${user.imgUrl || 'default_profile.png'}`" 
                @error="handleImageError(user.imgUrl)"
                class="h-12 w-12 rounded-full" />
        </a>
        <section class="col-start-2 col-span-8">
            <p class="font-bold">{{ user.name }}</p>
            <p class="text-dark text-sm">@{{ user.screenName }}</p>
            <p class="w-auto">{{ user.bio }}</p>
        </section>
        <div class="col-start-11 col-span-3 self-center" v-if="profile.id !== user.id">
            <button v-if="!user.following" @click="followUser()"
                class="text-blue font-bold px-4 py-2 rounded-full border border-blue hover:bg-lightblue">
                Follow
            </button>
            <button v-if="user.following" @mouseover="followingLabel = 'Unfollow'"
                @mouseleave="followingLabel = 'Following'" @click="unfollowUser()"
                class="text-white bg-blue font-bold px-4 py-2 rounded-full border hover:bg-red-700 hover:cursor-pointer">
                {{ followingLabel }}
            </button>
        </div>
    </li>
</template>