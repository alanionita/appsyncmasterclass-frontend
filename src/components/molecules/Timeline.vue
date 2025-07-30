<script setup>
import TextButton from '@/components/atoms/TextButton.vue';
import Tweet from '@/components/atoms/Tweet.vue';
import Retweet from '@/components/atoms/Retweet.vue';

const { tweets } = defineProps(['tweets']);

</script>
<template>
    <div>
        <section v-if="tweets.length === 0" class="flex flex-col items-center justify-center w-full gap-4 px-4">
            <p class="font-semibold text-lg">Welcome to Twitter!</p>
            <p class="text-sm text-dark text-center">This is the best place to see what’s happening in your world. Find
                some people and topics to follow now.</p>
            <TextButton text="Let's go!" action="() => {}" />
        </section>
        <section v-if="tweets.length > 0" v-for="tweet in tweets" :key="tweet.id">
            <Tweet v-if="!tweet.retweetOf" :tweet="tweet"/>

            <Retweet v-if="tweet.retweetOf" :tweet="tweet"/>
        </section>
    </div>
</template>