<script setup>
import { useMessages } from '@/stores/messages';
import { storeToRefs } from 'pinia';
import Message from '../atoms/Message.vue';
import Loader from '../atoms/Loader.vue';
import { useUi } from '@/stores/ui';
import { onUpdated, ref } from 'vue';
import { throwWithLabel } from '@/utils/error';
import { useConversations } from '@/stores/conversations';
import LinkifyText from '../atoms/LinkifyText.vue';

const storeUi = useUi();
const { loadingMessages } = storeToRefs(storeUi)
const storeMessages = useMessages();
const { messages, newMessage } = storeToRefs(storeMessages)
const storeConversations = useConversations();
const { activeOtherUserId, activeConversationId, activeConversationIsNew, activeOtherUserScreenName } = storeToRefs(storeConversations)

const disabled = ref(false);
const mainFocus = ref(null);

async function handleSendMessage(to) {
    try {
        disabled.value = true
        await storeMessages.send(to)
        disabled.value = false
    } catch (err) {
        throwWithLabel(err, 'MessagesList/handleSendMessage()')
    }
}

async function handleVScrollTop() {
    await storeMessages.listMore()
}

onUpdated(() => {
    // Required: onMount does not focus, likely a timing issues with the component load
    if (mainFocus.value) {
        mainFocus.value.focus()
    }
})

</script>

<template>
    <section v-if="!activeConversationId" id="message-no-conversation-selecte-notice"
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
    <section v-else class="h-full flex flex-col justify-between">
        <div v-if="loadingMessages" class="flex flex-col h-full justify-center">
            <Loader />
        </div>
        <ul v-else class="list-none w-full h-fit overflow-y-auto flex flex-col-reverse grow" role="list" v-on:scrollend.top="handleVScrollTop">
            <li v-for="message in messages" :key="message.messageId" :id="`message-${message.messageId}`"
                class="grid grid-col-6 grid-rows-1 gap-y-4 p-4 hover:bg-lightest cursor-text">
                <Message :message="message" />
            </li>
        </ul>
        <form @submit.prevent="() => handleSendMessage(activeOtherUserId)" class="flex flex-col">
            <section v-if="activeConversationIsNew" class="py-8 px-4 text-l gap-2 flex flex-col bg-lightblue">
                <LinkifyText :text="`This conversation is just between you and @${activeOtherUserScreenName}.`" />
                <p>
                    To learn more about them check out their profile.
                </p>
            </section>
            <fieldset class="bg-white p-4 border-t h-[8vh] border-lighter flex w-full justify-center">
                <label for="new-message" class="hidden">Enter new message</label>
                <input ref="mainFocus" id="new-message" name="new-message"
                    class="pl-8 rounded-full w-full p-2 bg-lighter text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue"
                    placeholder="Start a new message" type="search" v-model="newMessage" :disabled="disabled" />
                <button class="rounded-full focus:outline-none right-4 size-16"
                    :class="`${newMessage.length == 0 ? 'opacity-50 cursor-default' : 'hover:bg-lightblue'}`"
                    :disabled="disabled" type="submit">
                    <i class="fas fa-arrow-right text-xl text-blue"></i>
                </button>
            </fieldset>
        </form>
    </section>
</template>
