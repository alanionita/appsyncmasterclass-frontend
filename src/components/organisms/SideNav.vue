<script setup>
import { ref } from 'vue';
import TextButton from '../atoms/TextButton.vue';
import { useAuthStore } from '@/stores/authentication';
import { useTwitterStore } from '@/stores/twitter';

const authStore = useAuthStore();

const tabs = defineModel('tabs', {
    default: [
        { icon: 'fas fa-home', title: 'Home', id: 'home', target: 'Home' },
        { icon: 'fas fa-hashtag', title: 'Explore', id: 'explore' },
        { icon: 'far fa-bell', title: 'Notifications', id: 'notifications' },
        { icon: 'far fa-envelope', title: 'Messages', id: 'messages' },
        { icon: 'far fa-bookmark', title: 'Bookmarks', id: 'bookmarks' },
        { icon: 'fas fa-clipboard-list', title: 'Lists', id: 'lists' },
        { icon: 'far fa-user', title: 'Profile', id: 'profile', target: 'Profile' },
        { icon: 'fas fa-ellipsis-h', title: 'More', id: 'more' }
    ]
})

const twitterStore = useTwitterStore()

const dropdown = ref(false)

async function handleLogOut() {
    try {
        console.info('signing out...')
        await authStore.logout();
    } catch (err) {
        alert('Error signing out, please check console for error detail')
        console.error('error signing out: ', err)
    }
}
</script>

<template>
    <section class="h-screen border-r border-lighter lg:pr-4 flex flex-col items-center md:items-start min-w-max gap-4 justify-between">
        <div class="w-full flex flex-col gap-4">
            <button class="size-16 hover:bg-lightblue text-3xl text-blue rounded-full">
                <i class="fab fa-twitter"></i>
            </button>
            <nav class="flex flex-col gap-4 justify-center items-center md:items-start">
                <button v-for="tab in tabs" :key="tab.id"
                    class="focus:outline-none hover:text-blue flex items-center w-full justify-between gap-4 px-4 py-2 hover:bg-lightblue rounded-full">
                    <i class="text-2xl" :class="tab.icon"></i>
                    <p class="flex-1 text-lg font-semibold text-left hidden lg:block"> {{ tab.title }}</p>
                </button>
            </nav>
            <TextButton text="Tweet" action="() => {}" />
        </div>
        <div class="w-full relative pb-4">
            <button @click="dropdown = !dropdown" class="flex items-center w-full hover:bg-lightblue rounded-full p-4">
                <img :src="`${twitterStore.profileImg}`" class="w-10 h-10 rounded-full" />
                <div class="hidden lg:block ml-4 truncate">
                    <div class="text-left text-sm font-bold leading-tight truncate">{{ twitterStore.profile.name }}</div>
                    <div class="text-left text-sm leading-tight text-dark truncate">{{ twitterStore.profile.screenName }}</div>
                </div>
                <i class="hidden lg:block fas fa-angle-down ml-auto text-lg"></i>
            </button>
            <section v-if="dropdown === true"
                class="absolute bottom-0 left-0 w-64 rounded-lg shadow-md border-lightest bg-white mb-16">
                <button @click="dropdown = false" class="p-4 flex items-center w-full hover:bg-lightest">
                    <img :src="`${twitterStore.profileImg}`" class="w-10 h-10 rounded-full" />
                    <div class="ml-4">
                        <p class="text-left text-sm font-bold leading-tight">{{ twitterStore.profile.name }}</p>
                        <p class="text-left text-sm leading-tight text-dark">{{ twitterStore.profile.screenName }}</p>
                    </div>
                    <i class="fas fa-check ml-auto text-blue"></i>
                </button>
                <button class="w-full text-left hover:bg-lightest border-t border-lighter p-4 text-sm">
                    Add an existing account
                </button>
                <button @click="handleLogOut" class="w-full text-left hover:bg-lightest border-t border-lighter p-4 text-sm">
                    Log out {{ twitterStore.profile.screenName }}
                </button>
            </section>
        </div>
    </section>
</template>