<script setup>
import Tweet from '../atoms/Tweet.vue'
import Retweet from '../atoms/Retweet.vue'
import User from './User.vue'

import { storeToRefs } from 'pinia'
import { useSearchHashtags } from '@/stores/searchHashtags'

const storeSearchHashtags = useSearchHashtags()
const { results } = storeToRefs(storeSearchHashtags)

</script>
<template>
  <ul role="list" class="list-none mb-8">
    <template v-for="result in results" v-bind:key="result.id">
      <User v-if="result.screenName" :user="result" />
      <Retweet v-else-if="result.retweetOf" :tweet="result" />
      <Tweet v-else :tweet="result" />
    </template>
  </ul>
</template>
