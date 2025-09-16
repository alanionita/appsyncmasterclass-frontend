<script setup>
import { likeTweet, retweetTweet, unlikeTweet, unretweetTweet } from '@/services/graphql/controllers'
import { ref } from 'vue'
import ReplyOverlay from '../organisms/ReplyOverlay.vue';
import { useTwitterTimeline } from '@/stores/twitterTimeline';

const { tweet } = defineProps(["tweet"])
const timeline = useTwitterTimeline();
const replyUI = ref(false);

async function handleLikeBtn() {
    // TODO: add a debounce
    if (!tweet.liked) {
        tweet.liked = true
        tweet.likes++
        await likeTweet(tweet.id)
            .catch(err => {
                console.error(`failed to like tweet [${tweet.id}]`, err)
                tweet.liked = false
                tweet.likes--
            })
    } else {
        tweet.liked = false
        tweet.likes--
        await unlikeTweet(tweet.id)
            .catch(err => {
                console.error(`failed to unlike tweet [${tweet.id}]`, err)
                tweet.liked = true
                tweet.likes++
            })
    }
}

async function handleRetweetBtn() {
    // TODO: add a debounce
    if (!tweet.retweeted) {
        tweet.retweeted = true
        tweet.retweets++
        await retweetTweet(tweet.id)
            .catch(err => {
                console.error(`failed to retweet [${tweet.id}]`, err)
                tweet.retweeted = false
                tweet.retweets--
            })
        timeline.getMyTimeline();
    } else {
        tweet.retweeted = false
        tweet.retweets--
        await unretweetTweet(tweet.id)
            .catch(err => {
                console.error(`failed to unretweet [${tweet.id}]`, err)
                tweet.retweeted = true
                tweet.retweets++
            })
        timeline.getMyTimeline();
    }
}

async function handleReplyBtn() {
    replyUI.value = !replyUI.value
}

</script>

<template>
    <div v-if="tweet" class="w-full p-4 border-b border-lighter hover:bg-lightest flex">
        <div class="flex-none mr-4">
            <a :href="`/${tweet.profile.screenName}`">
                <img :src="`${tweet.profile.imgUrl || 'default_profile.png'}`"
                    class="h-12 w-12 rounded-full flex-none" />
            </a>
        </div>
        <div class="w-full">
            <a :href="`/${tweet.profile.screenName}`">
                <div class="flex items-center w-full">
                    <p class="font-semibold">{{ tweet.profile.name }}</p>
                    <p class="text-sm text-dark ml-2">@{{ tweet.profile.screenName }}</p>
                    <p class="text-sm text-dark ml-2">{{ $filters.timeago(tweet.createdAt) }}</p>
                    <i class="fas fa-angle-down text-sm ml-auto"></i>
                </div>

            </a>
            <p v-if="tweet.inReplyToUsers && tweet.inReplyToUsers.length > 0" class="text-dark">
                Replying to {{tweet.inReplyToUsers.map(x => `@${x.screenName}`).join(",")}}
            </p>

            <p class="pb-2">
                {{ tweet.text }}
            </p>
            <div class="flex w-full">
                <div class="flex items-center text-sm text-dark w-1/4">
                    <button @click="handleReplyBtn()" class="mr-2 rounded-full hover:bg-lighter cursor-pointer">
                        <i class="far fa-comment"></i>
                    </button>
                    <p v-if="tweet.replies > 0"> {{ tweet.replies }} </p>
                </div>
                <div class="flex items-center text-sm text-dark w-1/4">
                    <button @click="handleRetweetBtn()" class="mr-2 rounded-full hover:bg-lighter cursor-pointer">
                        <i :class="`fas fa-retweet ${tweet.retweeted ? 'text-green-500' : ''}`"></i>
                    </button>
                    <p v-if="tweet.retweets > 0"> {{ tweet.retweets }} </p>
                </div>
                <div class="flex items-center text-sm text-dark w-1/4">
                    <button @click="handleLikeBtn()" class="mr-2 rounded-full hover:bg-lighter cursor-pointer">
                        <i :class="`fas fa-heart ${tweet.liked ? 'text-red-600' : ''}`"></i>
                    </button>
                    <p v-if="tweet.likes > 0"> {{ tweet.likes }} </p>
                </div>
                <div class="flex items-center text-sm text-dark w-1/4">
                    <i class="fas fa-share-square mr-3"></i>
                </div>
            </div>
        </div>

        <ReplyOverlay v-if="replyUI" :tweet="tweet" @hide="handleReplyBtn" />
    </div>
</template>