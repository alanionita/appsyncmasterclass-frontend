<script setup>
import { useMessages } from '@/stores/messages';
import { storeToRefs } from 'pinia';
import Image from '../atoms/Image.vue';
import LinkifyText from '../atoms/LinkifyText.vue';

const storeMessages = useMessages();
const { conversations, activeConversation } = storeToRefs(storeMessages)

async function handleConversationClick(id) {
    await storeMessages.setActiveConversation(id)
}

function showNewBadge(conversation) { 
    return conversation.hasNewMessages
}

</script>

<template>
    <section v-if="storeMessages.conversationsAmount === 0"
        class="flex flex-col px-8 py-12 border-b border-lighter text-xl font-bold">
        <p class="font-bold text-lg">
            No conversations yet
        </p>
        <p class="text-sm text-dark">
            Send a new message or wait until someone starts a conversation.
        </p>
    </section>
    <ul v-else
        role="list"
        class="list-none h-screen w-full overflow-y-auto pb-80">
        <li v-for="conversation in conversations" v-bind:key="`${conversation.id}-${conversation.lastModified}`"
            class="grid grid-cols-(--grid-cols-6-avatar) grid-rows-3 p-2 pl-4 border-b border-lighter hover:bg-lightest cursor-pointer data-active:bg-lightblue"
            :data-active="conversation.id === activeConversation || undefined"
            @click="handleConversationClick(conversation.id)">
            <a class="col-start-1 col-span-1 row-start-1 row-span-3 w-fit flex flex-col justify-center" :href="`#/${conversation.otherUser.screenName}`">
                <Image :src="conversation.otherUser.imgUrl" :classStr="`h-12 w-12 rounded-full flex-none`"/>
            </a>
            <header class="col-start-2 col-span-4 row-start-1 row-span-2">
                <p class="font-semibold">{{ conversation.otherUser.name }}</p>
                <p class="hidden md:block text-sm text-dark truncate">@{{
                    conversation.otherUser.screenName }}
                </p>

            </header>

            <LinkifyText :text="conversation.lastMessage" :classStr="`col-start-2 col-span-4 row-start-3 row-span-1 truncate`" />
            <aside class="col-start-6 col-span-1 row-span-3 grid grid-rows-subgrid justify-items-end">
                <p class="row-start-1 row-span-1 text-sm text-dark">
                    {{ $filters.timeago(conversation.lastModified) }}
                </p>
                <figure v-if="showNewBadge(conversation)"
                    class="row-start-3 row-span-1 size-4 resize-both overflow-hidden self-end">
                    <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="var(--color-blue)"/>
                    </svg>
                </figure>
            </aside>
        </li>
    </ul>
</template>
