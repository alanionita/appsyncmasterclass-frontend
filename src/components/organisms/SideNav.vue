<script setup>
import { ref } from 'vue';
import TextButton from '../atoms/TextButton.vue';
import { useAuthStore } from '@/stores/authentication';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { useRouter, useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/utils/constants';
import NotificationBadge from '../atoms/NotificationBadge.vue';

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore();

const tabs = defineModel('tabs', {
    default: [
        { icon: 'text-xl fas fa-home', iconActive: 'text-2xl fas fa-home', title: 'Home', id: 'home', target: ROUTE_NAMES.Home },
        { icon: 'text-xl fas fa-hashtag', title: 'Explore', id: 'explore' },
        { icon: 'text-xl far fa-bell', iconActive: 'text-2xl fas fa-bell', title: 'Notifications', id: 'notifications', target: ROUTE_NAMES.Notifications },
        { icon: 'text-xl far fa-envelope', iconActive: 'text-2xl fas fa-envelope', title: 'Messages', id: 'messages', target: ROUTE_NAMES.Messages },
        { icon: 'text-xl far fa-bookmark', title: 'Bookmarks', id: 'bookmarks' },
        { icon: 'text-xl fas fa-clipboard-list', title: 'Lists', id: 'lists' },
        { icon: 'text-xl far fa-user', iconActive: 'text-2xl fas fa-user', title: 'Profile', id: 'profile', target: ROUTE_NAMES.Profile },
        { icon: 'text-xl fas fa-ellipsis-h', title: 'More', id: 'more' }
    ]
})

const profile = useTwitterMyProfile()

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

async function handleTabClick(target) {
    const current = route.name;
    if (target != current || (route.params.screenName != profile.screenName)) {
        let pushParam = {
            name: target
        }

        if (target === 'profile') {
            pushParam = Object.assign({}, pushParam, {
                params: {
                    screenName: profile.screenName
                }
            })
        }

        router.push(pushParam)
    }
}
</script>

<template>
    <section
        class="h-screen border-r border-lighter lg:pr-4 flex flex-col items-center md:items-start min-w-max gap-4 justify-between">
        <nav class="w-full flex flex-col gap-4">
            <button class="size-16 hover:bg-lightblue text-3xl text-blue rounded-full">
                <i class="fab fa-twitter"></i>
            </button>
            <ul class="grid grid-cols-1 gap-4">
                <li v-for="tab in tabs" :key="tab.id" class="row-span-1">
                    <a id="nav-link" target="_blank" @click="tab.target && handleTabClick(tab.target)" role="button"
                        :data-active="tab.id === route.name" 
                        :data-available="tab.target || false"
                        class="flex items-center w-full justify-between px-4 py-2 rounded-full cursor-pointer data-[active=true]:bg-lightblue data-[available=false]:cursor-not-allowed"
                        :class="tab.id === route.name ? 'gap-5' : 'gap-6'">
                        <i :class="tab.id === route.name ? tab.iconActive : tab.icon"></i>
                        <p class="flex-1 text-lg font-semibold text-left hidden lg:block"> 
                            {{ tab.title }}
                        </p>
                        <NotificationBadge v-if="tab.id === 'notifications'" />
                    </a>
                </li>
            </ul>
            <TextButton text="Tweet" action="() => {}" />
        </nav>
        <div class="w-full relative pb-4">
            <button @click="dropdown = !dropdown" class="flex items-center w-full hover:bg-lightblue rounded-full p-4">
                <img :src="`${profile.imgUrl}`" class="w-10 h-10 rounded-full" />
                <div class="hidden lg:block ml-4 truncate">
                    <div class="text-left text-sm font-bold leading-tight truncate">{{ profile.name }}
                    </div>
                    <div class="text-left text-sm leading-tight text-dark truncate">
                        {{ profile.screenName }}
                    </div>
                </div>
                <i class="hidden lg:block fas fa-angle-down ml-auto text-lg"></i>
            </button>
            <section v-if="dropdown === true"
                class="absolute bottom-0 left-0 w-64 rounded-lg shadow-md border-lightest bg-white mb-16">
                <button @click="dropdown = false" class="p-4 flex items-center w-full hover:bg-lightest">
                    <img :src="`${profile.imgUrl}`" class="w-10 h-10 rounded-full" />
                    <div class="ml-4">
                        <p class="text-left text-sm font-bold leading-tight">{{ profile.name }}</p>
                        <p class="text-left text-sm leading-tight text-dark">{{ profile.screenName }}</p>
                    </div>
                    <i class="fas fa-check ml-auto text-blue"></i>
                </button>
                <button class="w-full text-left hover:bg-lightest border-t border-lighter p-4 text-sm">
                    Add an existing account
                </button>
                <button @click="handleLogOut"
                    class="w-full text-left hover:bg-lightest border-t border-lighter p-4 text-sm">
                    Log out {{ profile.screenName }}
                </button>
            </section>
        </div>
    </section>
</template>