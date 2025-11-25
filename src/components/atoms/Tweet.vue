<script setup>
import { onMounted, ref } from 'vue'
import ReplyOverlay from '../organisms/ReplyOverlay.vue';
import { useTwitterTimeline } from '@/stores/twitterTimeline';
import { generateHtmlLinks } from '@/utils/urls';
import { useAppsync } from '@/stores/appsync';

const { tweet } = defineProps(["tweet"])
const { updateImgUrl } = useTwitterTimeline();
const { appsyncClient } = useAppsync();
const replyUI = ref(false);
const tweetTextEl = ref(null);
const tweetTextElHtml = ref(null);

async function handleLikeBtn() {
    // TODO: add a debounce
    if (!tweet.liked) {
        tweet.liked = true
        tweet.likes++
        await appsyncClient.likeTweet(tweet.id)
            .catch(err => {
                console.error(`failed to like tweet [${tweet.id}]`, err)
                tweet.liked = false
                tweet.likes--
            })
    } else {
        tweet.liked = false
        tweet.likes--
        await appsyncClient.unlikeTweet(tweet.id)
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
        await appsyncClient.retweetTweet(tweet.id)
            .catch(err => {
                console.error(`failed to retweet [${tweet.id}]`, err)
                tweet.retweeted = false
                tweet.retweets--
            })
    } else {
        await appsyncClient.unretweetTweet(tweet.id)
            .catch(err => {
                console.error(`failed to unretweet [${tweet.id}]`, err)
                tweet.retweeted = true
                tweet.retweets++
            })
        tweet.retweeted = false
        tweet.retweets--
    }
}

async function handleReplyBtn() {
    replyUI.value = !replyUI.value
}

async function handleImageError(event) {
    try {
        await updateImgUrl({
            url: event.target.currentSrc
        })
    } catch (err) {
        console.error('Err [twitterMyProfile/fetchSignedUrl] ::', err.message)
        console.info(JSON.stringify(err))
        return
    }
}

onMounted(() => {
    if (tweet.text && tweet.text.length > 0) {
        const tweetTextHtml = generateHtmlLinks(tweet.text)
        tweetTextElHtml.value = tweetTextHtml
    }
})

</script>

<template>
    <li v-if="tweet" :id="tweet.id" class="w-full p-4 border-b border-lighter hover:bg-lightest flex">
        <div class="flex-none mr-4">
            <a :href="`/${tweet.profile.screenName}`">
                <img :src="`${tweet.profile.imgUrl || 'default_profile.png'}`"
                    @error="handleImageError" class="h-12 w-12 rounded-full flex-none" />
            </a>
        </div>
        <div class="w-full">
            <div class="flex items-center w-full justify-between">
                <a id="custom-link" :href="`/${tweet.profile.screenName}`" class="flex items-center w-auto grow-0">
                    <p class="font-semibold">{{ tweet.profile.name }}</p>
                    <p class="text-sm text-dark ml-2">@{{ tweet.profile.screenName }}</p>
                    <p class="text-sm text-dark ml-2">{{ $filters.timeago(tweet.createdAt) }}</p>
                </a>
                <i class="fas fa-angle-down text-sm ml-auto"></i>
            </div>

            <p v-if="tweet.inReplyToUsers && tweet.inReplyToUsers.length > 0" class="text-dark">
                Replying to {{tweet.inReplyToUsers.map(x => `@${x.screenName}`).join(",")}}
            </p>

            <p ref="tweetTextEl" class="pb-2" v-html="tweetTextElHtml">
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
                        <i v-if="tweet.retweeted" :class="`fas fa-retweet text-green-500`"></i>
                        <i v-else :class="`fas fa-retweet`"></i>
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
    </li>
</template>