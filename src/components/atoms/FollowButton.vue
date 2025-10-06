<script setup>
import { useTwitterTheirProfile } from '@/stores/twitterTheirProfile';
import { ref } from 'vue';

const followLabel = 'Follow'
const theyFollowMeLabel = 'Follow back'
const followingLabel = ref('Following')
const { myProfile } = defineProps(['my-profile'])

const theirProfileStore = useTwitterTheirProfile();

async function followUser() {
    await theirProfileStore.follow()
}

async function unfollowUser() {
    await theirProfileStore.unfollow()
}

</script>

<template>
    <section v-if="!theirProfileStore.followed">
        <button
            @click="followUser()" 
            class="text-blue font-bold px-4 py-3 rounded-full border border-blue hover:bg-lightblue">
            {{ theirProfileStore.followMe ? theyFollowMeLabel : followLabel }}
        </button>
    </section>
    <section v-if="theirProfileStore.followed">
        <button 
            @mouseover="followingLabel = 'Unfollow'" 
            @mouseleave="followingLabel = 'Following'"
            @click="unfollowUser()" 
            class="text-white bg-blue font-bold px-4 py-3 rounded-full border hover:bg-red-700">
            {{ followingLabel }}
        </button>
    </section>
</template>