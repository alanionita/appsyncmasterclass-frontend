<script setup>

import Tweet from '../atoms/Tweet.vue'
import Retweet from '../atoms/Retweet.vue'
import User from './User.vue'
import { useSearch } from '@/stores/search';
import { storeToRefs } from 'pinia';

const storeSearch = useSearch()
const { results } = storeToRefs(storeSearch)

</script>
<template>
    <ul>
        <template v-for="result in results" v-bind:key="result.id" role="list" class="list-none">
            <User v-if="result.screenName" :user="result" />
            <Retweet v-else-if="result.retweetOf" :tweet="result" />
            <Tweet v-else :tweet="result" />
        </template>
    </ul>
</template>
