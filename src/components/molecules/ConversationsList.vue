<script setup>
import { useMessages } from '@/stores/messages';
import { storeToRefs } from 'pinia';

const storeMessages = useMessages();
const { conversations } = storeToRefs(storeMessages)


function selectConversation() { }

function hasNewMessages() { }

</script>

<template>
    <section class="h-fit">
        <div v-if="conversations.length === 0"
            class="grid grid-cols-12 grid-rows-1 w-full p-4 gap-2 border-b border-lighter text-xl font-bold">
            <section v-if="conversations.length === 0" class="flex flex-col items-center justify-center pt-16">
                <p class="font-bold text-lg">No conversations yet</p>
                <p class="text-sm text-dark">Wait until someone starts a conversation here.</p>
            </section>
        </div>
        <ul v-else v-for="conversation in conversations" v-bind:key="conversation.id" role="list" class="list-none">
            <div class="cursor-pointer"
                :class="(active && conversation.id == active.id) ? 'border-r-2 border-blue' : ''">
                <div class="w-full p-2 pt-1 pb-1 md:p-4 md:pt-2 md:pb-2 border-b border-lighter hover:bg-lightest flex"
                    :style="hasNewMessages(conversation) ? 'background-color:#e1f5fe;' : ''"
                    @click="selectConversation(conversation)">
                    <div class="flex-none mr-2 md:mr-4 pt-1">
                        <a :href="`#/${conversation.otherUser.screenName}`">
                            <img :src="`${conversation.otherUser.imgUrl || 'default_profile.png'}`"
                                class="h-12 w-12 rounded-full flex-none" />
                        </a>
                    </div>
                    <div class="w-full truncate">
                        <div class="flex items-center w-full">
                            <p class="font-semibold">{{ conversation.otherUser.name }}</p>
                            <p class="hidden md:block text-sm text-dark ml-2 truncate">@{{
                                conversation.otherUser.screenName }}
                            </p>
                            <p class="text-sm text-dark ml-auto">{{ $filters.timeago(conversation.lastModified) }}
                            </p>
                        </div>

                        <a id="custom-link" class="pb-2 truncate">
                            {{ conversation.lastMessage }}
                        </a>
                    </div>
                </div>
            </div>
        </ul>
    </section>
</template>
