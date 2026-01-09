<script setup>
import TextButton from '@/components/atoms/TextButton.vue';
import Tweet from '@/components/atoms/Tweet.vue';
import Retweet from '@/components/atoms/Retweet.vue';
import { useRoute } from 'vue-router';
import Loader from '../atoms/Loader.vue';
import { useUi } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { useTwitterTheirProfile } from '@/stores/twitterTheirProfile';
import { onMounted, onUpdated, ref } from 'vue';

const { tweets } = defineProps(['tweets']);
const uiStore = useUi()
const isSelf = ref(false);
const myProfile = useTwitterMyProfile();
const theirProfile = useTwitterTheirProfile();
const { loading } = storeToRefs(uiStore);

const route = useRoute();

function checkProfile() {
    if (route.path.includes(myProfile.screenName)) {
        isSelf.value = true
    } else {
        isSelf.value = false
    }
}

onMounted(() => {
    checkProfile()
})

onUpdated(() => {
    checkProfile()
})

</script>
<template>
    <Loader v-if="loading" />
    <section v-else-if="tweets.length === 0">
        <div v-if="route.name === 'home'"
            class="flex flex-col items-center justify-center w-full gap-4 mt-8 px-24 py-8">
            <p class="font-semibold text-lg">Welcome to Twitter!</p>
            <p class="text-sm text-dark text-center">This is the best place to see what is happening in your world.
                Find
                some people and topics to follow now.</p>
            <TextButton text="Let's go!" action="() => {}" />
        </div>
        <div v-if="isSelf" class="flex flex-col items-center justify-center w-full gap-4 mt-8 px-4 py-8">
            <p class="font-bold text-lg">You haven’t tweeted yet</p>
            <p class="text-sm text-dark">When you post a tweet, it will show up here.</p>
            <TextButton text="Tweet now" action="() => {}" />
        </div>
        <div v-else class="flex flex-col items-center justify-center w-full gap-4 mt-8 px-4 py-8">
            <p class="font-bold text-lg">{{ theirProfile.name || 'Account' }} hasn’t tweeted yet</p>
            <p class="text-sm text-dark">When they post a tweet, it will show up here.</p>
        </div>
    </section>
    <ul v-else-if="tweets.length > 0">
        <template v-for="tweet in tweets">
            <Tweet v-if="!tweet.retweetOf" :tweet="tweet" :key="tweet.id" />

            <Retweet v-if="tweet.retweetOf" :tweet="tweet" :key="tweet.id"/>
        </template>
    </ul>
</template>