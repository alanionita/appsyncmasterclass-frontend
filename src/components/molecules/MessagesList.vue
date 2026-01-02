<script setup>
import { useMessages } from '@/stores/messages';
import { storeToRefs } from 'pinia';
import Message from '../atoms/Message.vue';

const storeMessages = useMessages();
const { activeMessages } = storeToRefs(storeMessages)

function newMessage() { }

</script>

<template>
    <ul class="list-none h-screen w-full overflow-y-auto pb-80" role="list">
        <li v-if="activeMessages.length === 0"
            class="flex flex-col px-8 py-12 border-b border-lighter text-xl font-bold">
            <p class="font-bold text-lg">You don't have a conversation selected</p>
            <p class="text-sm text-dark">This is where you’ll see messages from people you don’t follow. They
                won’t know you’ve seen the request until you accept it.</p>
            <div class="flex justify-start mt-5">
                <button @click="newMessage()" type="button"
                    class="h-10 px-2 text-white font-semibold bg-blue hover:bg-darkblue rounded-full">
                    New Message
                </button>
            </div>

        </li>
        <li v-else v-for="message in activeMessages" :key="message.messageId" :data-message-id="message.messageId"
            class="grid grid-col-6 grid-rows-1 gap-y-4 p-4 hover:bg-lightest cursor-pointer">
            <Message :message="message"/>
        </li>
    </ul>
</template>
