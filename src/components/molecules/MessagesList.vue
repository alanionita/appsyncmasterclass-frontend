<script setup>
import { useMessages } from '@/stores/messages';
import { storeToRefs } from 'pinia';
import Message from '../atoms/Message.vue';
import Loader from '../atoms/Loader.vue';
import { useUi } from '@/stores/ui';
import { ref } from 'vue';
import { throwWithLabel } from '@/utils/error';

const storeUi = useUi();
const storeMessages = useMessages();
const { activeMessages, activeOtherUserId } = storeToRefs(storeMessages)

const disabled = ref(false);
const message = ref('');
const showNewMessageModal = ref(false);

function newMessage() { }

async function sendMessage(message, to) {
    try {
        disabled.value = true
        await storeMessages.sendMessage({
            message,
            to
        })
        disabled.value = false
    } catch (err) {
        throwWithLabel(err, 'MessagesList/sendMessage()')
    }
}

</script>

<template>
    <Loader v-if="storeUi.loadingMessages" />
    <section v-else-if="activeMessages.length === 0"
        id="message-no-conversation-selecte-notice"
        class="flex flex-col px-8 py-12 border-b border-lighter text-xl font-bold">
        <p class="font-bold text-lg">You don't have a conversation selected</p>
        <p class="text-sm text-dark">This is where you’ll see messages from people you don’t follow. They
            won’t know you’ve seen the request until you accept it.</p>
        <div class="flex justify-start mt-5">
            <button @click="storeUi.openNewMessageModal()" type="button"
                class="h-10 py-2 px-4 text-white text-sm font-semibold bg-blue hover:bg-darkblue rounded-full">
                New Message
            </button>
        </div>

    </section>
    <section v-else class="h-screen flex flex-col">
        <ul class="list-none w-full overflow-y-auto flex flex-col-reverse" role="list">
            <li v-for="message in storeMessages.activeMessages" 
                :key="message.messageId" 
                :id="`message-${message.messageId}`"
                class="grid grid-col-6 grid-rows-1 gap-y-4 p-4 hover:bg-lightest cursor-text">
                <Message :message="message" />
            </li>
        </ul>
        <form
            @submit.prevent="() => sendMessage(message, activeOtherUserId)" 
            class="bg-white p-4 border-t border-lighter flex w-full justify-center">
            <!-- TODO : verify need for ref= here -->
            <label for="new-message" class="hidden">Enter new message</label>
            <input ref="input"
                id="new-message"
                name="new-message"
                class="pl-8 rounded-full w-full p-2 bg-lighter text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue"
                placeholder="Start a new message" type="search" v-model="message"
                v-on:keyup.enter="() => sendMessage(message, activeOtherUserId)" :disabled="disabled" />
            <button class="rounded-full focus:outline-none right-4 size-16"
                :class="`${message.length == 0 ? 'opacity-50 cursor-default' : 'hover:bg-lightblue'}`"
                :disabled="disabled"
                type="submit">
                <i class="fas fa-arrow-right text-xl text-blue"></i>
            </button>
        </form>
    </section>
</template>
