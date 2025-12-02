<script setup>
import NotificationsList from '@/components/molecules/NotificationsList.vue';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { useNotifications } from '@/stores/notifications';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const notificationsStore = useNotifications();
const { mentions, mode, all } = storeToRefs(notificationsStore);
const { changeMode, resetBadge } = notificationsStore;

onMounted(() => {
    resetBadge()
})

</script>

<template>
    <ThreeColTemplate>
        <template #middle>
            <div class="w-full h-full overflow-y-auto">
                <header class="px-5 py-3 border-lighter flex items-center justify-between">
                    <h1 class="text-xl font-bold">Notifications</h1>
                    <i class="fas fa-cog text-xl text-blue"></i>
                </header>

                <nav class="grid grid-cols-2 grid-rows-1 text-sm">
                    <button @click="changeMode(router, 'all')"
                        class="text-dark font-bold border-b-2 p-4 hover:bg-lightblue sm:truncate cursor-pointer"
                        :class="`${mode == 'All' ? 'border-blue' : ''}`">All</button>
                    <button @click="changeMode(router, 'mentions')"
                        class="text-dark font-bold border-b-2 p-4 hover:bg-lightblue sm:truncate cursor-pointer"
                        :class="`${mode == 'Mentions' ? 'border-blue' : ''}`">Mentions</button>
                </nav>

                <NotificationsList v-if="(mode === 'All')" :mode="mode" :notifications="all" />
                
                <NotificationsList v-if="(mode === 'Mentions')" :mode="mode" :notifications="mentions" />
            </div>
        </template>
    </ThreeColTemplate>
</template>