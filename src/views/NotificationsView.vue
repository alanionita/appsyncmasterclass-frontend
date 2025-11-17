<script setup>
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { useNotifications } from '@/stores/notifications';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const notificationsStore = useNotifications();
const { mode } = storeToRefs(notificationsStore);
const { changeMode } = notificationsStore;

</script>

<template>
    <ThreeColTemplate>
        <template #middle>
            <div class="w-full h-full overflow-y-auto">
                <div class="px-5 py-3 border-lighter flex items-center justify-between">
                    <h1 class="text-xl font-bold">Notifications</h1>
                    <i class="fas fa-cog text-xl text-blue"></i>
                </div>

                <div class="flex flex-col">
                    <div class="flex flex-row justify-evenly text-sm">
                        <button @click="changeMode(router, 'all')"
                            class="w-full text-dark font-bold border-b-2 p-1 md:px-3 md:py-4 hover:bg-lightblue sm:truncate"
                            :class="`${mode == 'All' ? 'border-blue' : ''}`">All</button>
                        <button @click="changeMode(router, 'mentions')"
                            class="w-full text-dark font-bold border-b-2 p-1 md:px-3 md:py-4 hover:bg-lightblue sm:truncate"
                            :class="`${mode == 'Mentions' ? 'border-blue' : ''}`">Mentions</button>
                    </div>
                </div>
            </div>
        </template>
    </ThreeColTemplate>
</template>