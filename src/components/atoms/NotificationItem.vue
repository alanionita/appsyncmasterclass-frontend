<script setup>
import { onMounted, ref } from 'vue';
import * as S3Urls from '@/services/s3/urls';

const { notification } = defineProps(["notification"])

const imgUrl = ref('default_profile.png');

async function handleImgUrlError(event) {
    try {
        const newImgUrl = await S3Urls.refreshSignedUrl(event.target.currentSrc)
        imgUrl.value = newImgUrl
    } catch (err) {
        console.error('Err [twitterMyProfile/fetchSignedUrl] ::', err.message)
        console.info(JSON.stringify(err))
        return
    }
}

onMounted(() => {
    if(notification.profile.imgUrl) {
        imgUrl.value = notification.profile.imgUrl
    }
})

</script>

<template>
    <li :key="notification.id" class="grid grid-cols-1 grid-rows-2 md:p-4 gap-2 border-b border-dark hover:bg-lightest">
        <section class="flex gap-2 md:gap-4 text-2xl items-center">
            <i v-if="notification.type == 'Replied'" class="fas fa-comment text-blue"></i>
            <i v-if="notification.type == 'Liked'" class="fas fa-heart text-red-600"></i>
            <i v-if="notification.type == 'Retweeted'" class="fas fa-retweet text-green-500"></i>

            <a :href="`/profile/${notification.profile.screenName}`">
                <img :src="`${imgUrl}`" @error="handleImgUrlError"
                    class="size-8 rounded-full" />
            </a>
        </section>
        <section class="flex items-center justify-between">
            <a id="custom-link" :href="`/profile/${notification.profile.screenName}`">
                <p class="font-sm">{{ '@' + notification.profile.screenName }}</p>
            </a>
            <p class="text-sm text-dark">{{ $filters.timeago(notification.createdAt) }}</p>
        </section>
    </li>
</template>