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
        <aside class="flex p-2 flex-row">
            <span class="w-12 mr-4 flex justify-end">
                <i class="text-sm pt-1 fas fa-retweet text-dark"></i>
            </span>
            <p class="text-sm text-dark">{{ label }}</p>
        </aside>

        <Tweet :tweet="tweet.retweetOf" />
    </li>
</template>
