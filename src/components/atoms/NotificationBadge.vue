<script setup>
import { useNotifications } from '@/stores/notifications';
const storeNotifications = useNotifications()
</script>

<template>
    <figure v-if="storeNotifications.newBadge > 0" class="absolute -mt-6 ml-2" role="figure" aria-labelledby="notification-badge">
        <svg class="size-6" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">
            <circle cx="50" cy="50" r="45" fill="var(--color-blue)" stroke="var(--color-blue)" stroke-width="2" />
            <text x="50" y="55" 
                text-anchor="middle"   
                dominant-baseline="middle" 
                fill="white" 
                font-size="48" 
                font-family="Arial, sans-serif"
                font-weight="bold">
                    {{ storeNotifications.newBadge }}
            </text>
        </svg>
    </figure>
</template>