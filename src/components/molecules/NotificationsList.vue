<script setup>
import NotificationsListEmpty from './NotificationsListEmpty.vue';
import * as S3Urls from '@/services/s3/urls';

const { notifications } = defineProps(["mode", "notifications"])

async function handleImgUrlError({url, itemId}) {
    try {
        const errItemIdx = notifications.reduce((acc, item, index) => {
            return item.id === itemId ? index : acc;
        }, -1);
        if (url && errItemIdx > 0) {
            notifications[errItemIdx].profile.imgUrl = await S3Urls.refreshSignedUrl(url)
        }
    } catch (err) {
        console.error('Err [NotificationList/handleImgUrlError] ::', err.message)
        console.info(JSON.stringify(err))
        return
    }
}

</script>

<template>
    <ul class="grid grid-cols-1 grid-rows-auto">
        <NotificationsListEmpty v-if="!notifications || notifications.length === 0" />

        <li v-for="notification in notifications" :key="notification.id"
            class="grid grid-cols-1 grid-rows-2 md:p-4 gap-2 border-b border-dark hover:bg-lightest">
            <section class="flex gap-2 md:gap-4 text-2xl items-center">
                <i v-if="notification.type == 'Replied'" class="fas fa-comment text-blue"></i>
                <i v-if="notification.type == 'Liked'" class="fas fa-heart text-red-600"></i>
                <i v-if="notification.type == 'Retweeted'" class="fas fa-retweet text-green-500"></i>

                <a :href="`/profile/${notification.profile.screenName}`">
                    <img :src="`${notification.profile.imgUrl || 'default_profile.png'}`" @error="handleImgUrlError({
                        itemId: notification.id,
                        url: notification.profile.imgUrl
                    })" class="size-8 rounded-full" />
                </a>
            </section>
            <section class="flex items-center justify-between">
                <a id="custom-link" :href="`/profile/${notification.profile.screenName}`">
                    <p class="font-sm">{{ '@' + notification.profile.screenName }}</p>
                </a>
                <p class="text-sm text-dark">{{ $filters.timeago(notification.createdAt) }}</p>
            </section>
        </li>
    </ul>
</template>