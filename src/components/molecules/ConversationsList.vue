<script setup>
import { useMessages } from '@/stores/messages';
import { storeToRefs } from 'pinia';
import Image from '../atoms/Image.vue';

const storeMessages = useMessages();
const { conversations, activeConversation } = storeToRefs(storeMessages)

function handleConversationClick(id) {
    storeMessages.setActiveConversation(id)
}

function hasNewMessages() { }

</script>

<template>
    <ul class="list-none h-screen w-full overflow-y-auto pb-80" role="list">
        <li v-if="storeMessages.conversationsAmount === 0"
            class="flex flex-col px-8 py-12 border-b border-lighter text-xl font-bold">
            <p class="font-bold text-lg">
                No conversations yet
            </p>
            <p class="text-sm text-dark">
                Wait until someone starts a conversation here.
            </p>
        </li>
        <li v-else v-for="conversation in conversations" v-bind:key="conversation.id"
            class="grid grid-col-6 grid-rows-1 gap-2 p-2 border-b border-lighter hover:bg-lightest cursor-pointer data-active:bg-lightblue"
            :data-active="conversation.id === activeConversation || undefined"
            @click="handleConversationClick(conversation.id)">
            <a class="col-start-0 col-span-1 row-end-1" :href="`#/${conversation.otherUser.screenName}`">
                <figure class="h-full w-full flex items-center ml-2">
                    <Image :src="conversation.otherUser.imgUrl" :classStr="`h-12 w-12 rounded-full flex-none`"/>
                </figure>
            </a>
            <section class="col-start-2 col-span-4 row-end-1 items-center flex-col">
                <p class="font-semibold">{{ conversation.otherUser.name }}</p>
                <p class="hidden md:block text-sm text-dark truncate">@{{
                    conversation.otherUser.screenName }}
                </p>

                {{ conversation.lastMessage }}
            </section>

            <aside class="col-start-6 col-span-1 row-end-1 grid grid-cols-1 grid-rows-3 gap-2 truncate justify-items-end">
                <p class="row-start-0 row-span-1 text-sm text-dark">
                    {{ $filters.timeago(conversation.lastModified) }}
                </p>
                <figure v-if="hasNewMessages(conversation)"
                    class="row-start-2 row-span-1 size-4 resize-both overflow-hidden self-end">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="var(--color-blue)"/>
                    </svg>
                </figure>
            </aside>
        </li>
    </ul>
</template>
