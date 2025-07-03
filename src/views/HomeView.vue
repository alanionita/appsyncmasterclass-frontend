<script setup>
import { onMounted } from 'vue'
import { store } from '@/store'
import * as gql from '@/services/graphql/controllers'
import SideNav from '@/components/organisms/SideNav.vue'
import TextButton from '@/components/atoms/TextButton.vue';

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
      <SideNav></SideNav>
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
      <div class="flex h-full flex-col overflow-y-auto gap-4 pr-4" v-else-if="store.profile">
        <section class="border-b border-lighter flex items-center justify-between py-4">
          <h1 class="text-2xl font-semibold">Home</h1>
          <i class="far fa-star text-xl text-blue"></i>
        </section>
        <section class="border-b-4 border-lighter flex gap-4 py-4">
          <div class="flex-none">
            <img :src="'default_profile.png'" class="flex-none size-12 rounded-full" />
          </div>
          <form class="flex flex-col w-full relative gap-4">
            <textarea v-model="tweet.text" placeholder="What's happening?"
              class="flex-1 w-full focus:outline-none py-2"></textarea>
            <div class="flex h-fit justify-between items-center">
              <nav class="flex gap-4">
                <i class="text-lg text-blue far fa-image"></i>
                <i class="text-lg text-blue fas fa-film"></i>
                <i class="text-lg text-blue far fa-chart-bar"></i>
                <i class="text-lg text-blue far fa-smile"></i>
              </nav>
              <button type="button" class="h-12 px-4 text-white font-semibold bg-blue hover:bg-darkblue rounded-full"
                :class="`${this.tweet.text ? '' : ' opacity-50 cursor-not-allowed'}`">Tweet</button>
            </div>
          </form>
        </section>

        <!-- timeline -->
        <section v-if="tweets.length === 0" class="flex flex-col items-center justify-center w-full gap-4 px-4">
          <p class="font-semibold text-lg">Welcome to Twitter!</p>
          <p class="text-sm text-dark text-center">This is the best place to see what’s happening in your world. Find
            some people and topics to follow now.</p>
          <TextButton text="Let's go!" action="() => {}"/>
        </section>

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
