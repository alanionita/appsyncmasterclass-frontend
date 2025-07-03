<script setup>
import { onMounted } from 'vue'
import { store } from '@/store'
import * as gql from '@/services/graphql/controllers'

const tweet = defineModel('tweet', {
  default: {
    text: ''
  }
});
const tweets = defineModel('tweets', { default: [] })

const fetchData = async () => {
  try {
    store.togglePending()
    store.clearError();

    const result = await gql.getMyProfile()
    store.setProfile(result)
  } catch (err) {
    const newErr = err.message || 'Failed to fetch data'
    store.setError(newErr)
    console.error('Error (fetchData): ', err)
  } finally {
    store.togglePending()
  }
}

onMounted(async () => {
  await fetchData()
})

</script>

<template>
  <main class="flex container h-screen w-full m-auto gap-4 p-4">
    <section class="flex flex-col flex-3/12">
      <p>Left bar</p>
      <p>test</p>
    </section>
    <section class="flex flex-col flex-6/12">
      <div v-if="store.pending">
        <p>Loading data...</p>
      </div>

      <div v-else-if="store.error">
        <h2>Error Loading Data</h2>
        <p>{{ store.error }}</p>
        <button @click="fetchData">Try Again</button>
      </div>
      <div class="overflow-y-scroll" v-else-if="store.profile">
        <div class="px-5 py-3 border-b border-lighter flex items-center justify-between">
          <h1 class="text-xl font-bold">Home</h1>
          <i class="far fa-star text-xl text-blue"></i>
        </div>
        <div class="px-5 py-3 border-b-8 border-lighter flex">
          <div class="flex-none mr-4">
            <img :src="'default_profile.png'" class="flex-none w-12 h-12 rounded-full" />
          </div>
          <form class="w-full relative">
            <textarea v-model="tweet.text" placeholder="What's happening?"
              class="w-full focus:outline-none mt-3 pb-3"></textarea>
            <div>
              <i class="text-lg text-blue mr-4 far fa-image"></i>
              <i class="text-lg text-blue mr-4 fas fa-film"></i>
              <i class="text-lg text-blue mr-4 far fa-chart-bar"></i>
              <i class="text-lg text-blue mr-4 far fa-smile"></i>
            </div>
            <button type="button"
              class="h-10 px-4 text-white font-semibold bg-blue hover:bg-darkblue rounded-full absolute bottom-0 right-0 "
              :class="`${this.tweet.text ? '' : ' opacity-50 cursor-not-allowed'}`">Tweet</button>
          </form>
        </div>

        <!-- timeline -->
        <div v-if="tweets.length === 0" class="flex flex-col items-center justify-center w-full pt-10 px-6">
          <p class="font-bold text-lg">Welcome to Twitter!</p>
          <p class="text-sm text-dark text-center">This is the best place to see what’s happening in your world. Find
            some people and topics to follow now.</p>
          <button class="text-white bg-blue rounded-full font-semibold mt-4 px-4 py-2 hover:bg-darkblue">
            <p class="hidden lg:block">Let's go!</p>
            <i class="fas fa-plus lg:hidden"></i>
          </button>
        </div>

        <!-- TODO: remove, left to show use of store for profile -->
        <!-- <h2>Hello {{ store.profile.name }}</h2>
        <section>
          <p>Likes: {{ store.profile.likesCount }}</p>
          <p>Following: {{ store.profile.followingCount }}</p>
          <p>Followers: {{ store.profile.followersCount }}</p>
        </section>
        <section>
          <h3>Tweets ({{ store.profile.tweetsCount }})</h3>
          <div v-if="store.profile && store.profile.tweetsCount > 0">
            <div v-for="tweet in store.profile.tweets" :key="tweet.id">
              <h3>{{ tweet.author }}</h3>
              <p>{{ tweet.text }}</p>
              <small>Created: {{ tweet.createdAt }}</small>
            </div>
          </div>
        </section> -->
      </div>
    </section>
    <section class="flex flex-col flex-3/12">
      <p>right bar</p>
      <p>test</p>
    </section>

  </main>
</template>
