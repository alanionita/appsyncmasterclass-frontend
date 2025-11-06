<script setup>
import Tweet from './Tweet.vue'
import { useAuthStore } from '@/stores/authentication'
import { onMounted, ref } from 'vue';

const { user } = useAuthStore();

const { tweet } = defineProps(['tweet'])

const label = ref('You Retweeted')

onMounted(() => {
    if (!user.username === tweet.profile.id) {
        label.value = `@${tweet.profile.screenName} Retweeted`
    }
})

</script>

<template>
    <li class="w-full border-b border-lighter hover:bg-lightest flex flex-col">
        <!-- Retweet header -->
        <div class="pt-4 pl-4 flex flex-row">
            <div class="w-12 mr-4 flex justify-end">
                <i class="text-sm pt-1 fas fa-retweet text-dark"></i>
            </div>
            <p class="text-sm text-dark">{{ label }}</p>
        </div>

        <Tweet :tweet="tweet.retweetOf" />
    </li>
</template>
