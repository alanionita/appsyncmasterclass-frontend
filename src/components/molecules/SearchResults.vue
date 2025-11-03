<script setup>

import Tweet from '../atoms/Tweet.vue'
import Retweet from '../atoms/Retweet.vue'
import User from './User.vue'

const { results } = defineProps(['results'])

</script>
<template>
    <div>
        <div v-for="result in results" :key="result.id">
            <Tweet v-if="!result.retweetOf" :tweet="result" />
            <Retweet v-if="result.retweetOf" :tweet="result" />
            <User v-if="result.screenName" :user="result" />
        </div>
    </div>
</template>
