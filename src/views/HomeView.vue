<script setup>
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/authentication';
import { useTwitterTimeline } from '@/stores/twitterTimeline';
import Timeline from '@/components/molecules/Timeline.vue';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';

const tweet = defineModel('tweet');

const path = ref(window.location.pathname)

const profile = useTwitterMyProfile();
const timeline = useTwitterTimeline();

// TODO: implement UI store with values for: error, pending

async function loginUserIfAlreadyAuthenticated() {
  const authStore = useAuthStore();
  await authStore.verifyAuth(path);
}

function fetchPageData() {
  timeline.getMyTimeline()
}

async function postNewTweet() {
  if (!tweet.value.length === 0) return;
  await timeline.createTweet(tweet.value);
  tweet.value = ''
}

onMounted(() => {
  loginUserIfAlreadyAuthenticated()
  fetchPageData()
})

</script>

<template>
  <ThreeColTemplate>
    <template #middle>
      <div v-if="profile" class="flex h-full flex-col overflow-y-auto gap-4">
        <section class="border-b border-lighter flex items-center justify-between py-4">
          <h1 class="text-2xl font-semibold">Home</h1>
          <i class="far fa-star text-xl text-blue"></i>
        </section>
        <section class="border-b border-lighter flex gap-4 pb-4">
          <form class="flex flex-col w-full relative gap-4" @submit.prevent="postNewTweet">
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
              <button type="submit" :disabled="!tweet"
                class="sm:self-end h-12 px-4 text-white font-semibold bg-blue hover:bg-darkblue rounded-full disabled:cursor-not-allowed disabled:bg-lighter">Tweet</button>
            </div>
          </form>
        </section>

        <!-- timeline -->
        <Timeline :tweets="timeline.tweets" />
      </div>
    </template>
  </ThreeColTemplate>
</template>