<script setup>
import TextButton from '@/components/atoms/TextButton.vue';
import Tweet from '@/components/atoms/Tweet.vue';
import Retweet from '@/components/atoms/Retweet.vue';
import { useRoute } from 'vue-router';

const { tweets } = defineProps(['tweets']);

const route = useRoute();

console.log({ route })

</script>
<template>
    <div>
        <section v-if="tweets.length === 0">
            <div v-if="route.name === 'home'" class="flex flex-col items-center justify-center w-full gap-4 mt-8 px-24 py-8">
                <p class="font-semibold text-lg">Welcome to Twitter!</p>
                <p class="text-sm text-dark text-center">This is the best place to see what’s happening in your world.
                    Find
                    some people and topics to follow now.</p>
                <TextButton text="Let's go!" action="() => {}" />
            </div>
            <div class="flex flex-col items-center justify-center w-full gap-4 mt-8 px-4 py-8">
                <p class="font-bold text-lg">You haven’t Tweeted yet</p>
                <p class="text-sm text-dark">When you post a Tweet, it’ll show up here.</p>
                <TextButton text="Tweet now" action="() => {}" />
            </div>
        </section>
        <section v-if="tweets.length > 0" v-for="tweet in tweets" :key="tweet.id">
            <Tweet v-if="!tweet.retweetOf" :tweet="tweet" />

            <Retweet v-if="tweet.retweetOf" :tweet="tweet" />
        </section>
    </div>
</template>