<script setup>
import { store } from '@/store'
import SideNav from '@/components/organisms/SideNav.vue'
import TextButton from '@/components/atoms/TextButton.vue';
import DefaultRightBar from '@/components/organisms/DefaultRightBar.vue';
import { useTwitterProfile } from '@/stores/twitterProfile';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authentication';
import { useTwitterTimeline } from '@/stores/twitterTimeline';

const tweet = defineModel('tweet');

const path = ref(window.location.pathname)

const profile = useTwitterProfile();
const timeline = useTwitterTimeline();

// TODO: implement UI store with values for: error, pending

async function loginUserIfAlreadyAuthenticated() {
  const authStore = useAuthStore();
  await authStore.verifyAuth(path);
  timeline.getMyTimeline();
}

async function addNewTweet() {
  if (!tweet.value.length === 0) return;
  await timeline.createTweet(tweet.value);
  tweet.value = ''
}

onMounted(() => loginUserIfAlreadyAuthenticated())

</script>

<template>
  <main class="flex container h-screen w-screen m-auto gap-4 p-4">
    <section class="flex-1/12 lg:flex-3/12 flex flex-col">
      <SideNav></SideNav>
    </section>
    <section class="flex-11/12 lg:flex-6/12 flex flex-col">
      <div v-if="store.pending">
        <p>Loading data...</p>
      </div>

      <div v-else-if="store.error">
        <h2>Error Loading Data</h2>
        <p>{{ store.error }}</p>
        <button @click="fetchData">Try Again</button>
      </div>
      <div class="flex h-full flex-col overflow-y-auto gap-4" v-else-if="profile">
        <section class="border-b border-lighter flex items-center justify-between py-4">
          <h1 class="text-2xl font-semibold">Home</h1>
          <i class="far fa-star text-xl text-blue"></i>
        </section>
        <section class="border-b border-lighter flex gap-4 pb-4">
          <form class="flex flex-col w-full relative gap-4" @submit.prevent="addNewTweet">
            <div class="flex justify-center gap-4">
              <figure class="flex-none">
                <img :src="`${profile.imgUrl}`" class="flex-none size-12 rounded-full" />
              </figure>
              <textarea v-model="tweet" placeholder="What's happening?"
                class="flex-1 w-full focus:outline-none py-2"></textarea>
            </div>
            <div class="flex h-fit justify-between items-center">
              <nav class="flex gap-4">
                <i class="text-lg text-blue far fa-image"></i>
                <i class="text-lg text-blue fas fa-film"></i>
                <i class="text-lg text-blue far fa-chart-bar"></i>
                <i class="text-lg text-blue far fa-smile"></i>
              </nav>
              <button type="submit"
                :disabled="!tweet"
                class="sm:self-end h-12 px-4 text-white font-semibold bg-blue hover:bg-darkblue rounded-full disabled:cursor-not-allowed disabled:bg-lighter">Tweet</button>
            </div>
          </form>
        </section>

        <!-- timeline -->
        <section v-if="timeline.tweets.length === 0"
          class="flex flex-col items-center justify-center w-full gap-4 px-4">
          <p class="font-semibold text-lg">Welcome to Twitter!</p>
          <p class="text-sm text-dark text-center">This is the best place to see what’s happening in your world. Find
            some people and topics to follow now.</p>
          <TextButton text="Let's go!" action="() => {}" />
        </section>
        <section v-if="timeline.tweets.length > 0" v-for="tweet in timeline.tweets" :key="tweet.id">
          <div class="w-full p-4 border-b hover:bg-lightest flex">
            <div class="flex-none mr-4">
              <img :src="`${tweet.profile.imgUrl || 'default_profile.png'}`"
                class="h-12 w-12 rounded-full flex-none" />
            </div>
            <div class="w-full">
              <div class="flex items-center w-full">
                <p class="font-semibold">{{ tweet.profile.name }}</p>
                <p class="text-sm text-dark ml-2">@{{ tweet.profile.screenName }}</p>
                <p class="text-sm text-dark ml-2">{{ tweet.time }}</p>
                <i class="fas fa-angle-down text-sm ml-auto"></i>
              </div>
              <p v-if="tweet.inReplyToUser" class="text-dark">
                Replying to @{{ tweet.inReplyToUser.screenName }}
              </p>
              <p class="pb-2">
                {{ tweet.text }}
              </p>
              <div class="flex w-full">
                <div class="flex items-center text-sm text-dark w-1/4">
                  <button class="mr-2 rounded-full hover:bg-lighter">
                    <i class="far fa-comment"></i>
                  </button>
                  <p v-if="tweet.replies > 0"> {{ tweet.replies }} </p>
                </div>
                <div class="flex items-center text-sm text-dark w-1/4">
                  <button class="mr-2 rounded-full hover:bg-lighter">
                    <i :class="`fas fa-retweet ${tweet.retweeted ? 'text-green-500' : ''}`"></i>
                  </button>
                  <p v-if="tweet.retweets > 0"> {{ tweet.retweets }} </p>
                </div>
                <div class="flex items-center text-sm text-dark w-1/4">
                  <button class="mr-2 rounded-full hover:bg-lighter">
                    <i :class="`fas fa-heart ${tweet.liked ? 'text-red-600' : ''}`"></i>
                  </button>
                  <p v-if="tweet.likes > 0"> {{ tweet.likes }} </p>
                </div>
                <div class="flex items-center text-sm text-dark w-1/4">
                  <i class="fas fa-share-square mr-3"></i>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
    <section class="hidden md:flex md:flex-col md:flex-3/12">
      <DefaultRightBar />
    </section>
  </main>
</template>
