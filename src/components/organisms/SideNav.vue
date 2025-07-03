<script setup>
import TextButton from '../atoms/TextButton.vue';

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
</script>

<template>
    <section class="border-r border-lighter lg:pr-8 flex flex-col items-center md:items-start min-w-max gap-4">
        <button class="size-16 hover:bg-lightblue text-3xl text-blue rounded-full">
            <i class="fab fa-twitter"></i>
        </button>
        <nav class="flex flex-col gap-4 justify-center items-center md:items-start">
            <button v-for="tab in tabs" :key="tab.id"
                class="focus:outline-none hover:text-blue flex items-center justify-between gap-4 px-4 py-2 hover:bg-lightblue rounded-full">
                <i class="text-2xl" :class="tab.icon"></i>
                <p class="flex-1 text-lg font-semibold text-left hidden lg:block"> {{ tab.title }}</p>
            </button>
        </nav>
        <TextButton text="Tweet" action="() => {}" />
    </section>
</template>