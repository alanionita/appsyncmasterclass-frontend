<script setup>
import NotificationsListEmpty from './NotificationsListEmpty.vue';
import NotificationItem from '../atoms/NotificationItem.vue';

const { notifications } = defineProps(["mode", "notifications"])

</script>

<template>
    <ul class="grid grid-cols-1 grid-rows-auto">
        <NotificationsListEmpty v-if="!notifications || notifications.length === 0" />

        <NotificationItem v-for="notification in notifications" :key="notification.id" :notification="notification" />
    </ul>
</template>