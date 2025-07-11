<script setup>
import { store } from '@/store'
import SideNav from '@/components/organisms/SideNav.vue'
import TextButton from '@/components/atoms/TextButton.vue';
import DefaultRightBar from '@/components/organisms/DefaultRightBar.vue';
import { useTwitterProfile } from '@/stores/twitterProfile';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authentication';

const tweet = defineModel('tweet', {
  default: {
    text: ''
  }
});

const tweets = defineModel('tweets', { default: [] })
const path = ref(window.location.pathname)

const profile = useTwitterProfile();

// TODO: implement UI store with values for: error, pending

async function loginUserIfAlreadyAuthenticated() {
  const authStore = useAuthStore();
  await authStore.verifyAuth(path);
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
          <form class="flex flex-col w-full relative gap-4">
            <div class="flex justify-center gap-4">
              <figure class="flex-none">
                <img :src="`${profile.imgUrl}`" class="flex-none size-12 rounded-full" />
              </figure>
              <textarea v-model="tweet.text" placeholder="What's happening?"
                class="flex-1 w-full focus:outline-none py-2"></textarea>
            </div>
            <div class="flex h-fit justify-between items-center">
              <nav class="flex gap-4">
                <i class="text-lg text-blue far fa-image"></i>
                <i class="text-lg text-blue fas fa-film"></i>
                <i class="text-lg text-blue far fa-chart-bar"></i>
                <i class="text-lg text-blue far fa-smile"></i>
              </nav>
              <button type="button"
                class="sm:self-end h-12 px-4 text-white font-semibold bg-blue hover:bg-darkblue rounded-full"
                :class="`${tweet.text ? '' : ' opacity-50 cursor-not-allowed'}`">Tweet</button>
            </div>
          </form>
        </section>

        <!-- timeline -->
        <section v-if="tweets.length === 0" class="flex flex-col items-center justify-center w-full gap-4 px-4">
          <p class="font-semibold text-lg">Welcome to Twitter!</p>
          <p class="text-sm text-dark text-center">This is the best place to see what’s happening in your world. Find
            some people and topics to follow now.</p>
          <TextButton text="Let's go!" action="() => {}" />
        </section>
      </div>
    </section>
    <section class="hidden md:flex md:flex-col md:flex-3/12">
      <DefaultRightBar />
    </section>

  </main>
</template>
