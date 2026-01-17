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
        <aside class="flex px-0 pt-2 ml-3 md:ml-14 flex-row gap-2">
            <span class="w-fit">
                <i class="text-sm pt-1 fas fa-retweet text-dark"></i>
            </span>
            <p class="text-sm text-dark">{{ label }}</p>
        </aside>

        <Tweet :tweet="tweet.retweetOf" />
    </li>
</template>
