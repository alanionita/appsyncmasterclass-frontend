<script setup>
import { onMounted } from 'vue'
import { store } from '@/store'
import * as gql from '@/services/graphql/controllers'

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
  <main>
    <div v-if="store.pending">
      <p>Loading data...</p>
    </div>

    <div v-else-if="store.error">
      <h2>Error Loading Data</h2>
      <p>{{ store.error }}</p>
      <button @click="fetchData">Try Again</button>
    </div>

    <div v-else-if="store.profile">
      <h2>Hello {{ store.profile.name }}</h2>
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
      </section>
    </div>
  </main>
</template>
