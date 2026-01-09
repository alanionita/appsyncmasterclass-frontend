<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import Image from '../atoms/Image.vue';
import Loader from '../atoms/Loader.vue'
import NewMessageResults from '../molecules/NewMessageResults.vue';
import Overlay from '../templates/Overlay.vue';

import { useSearchUsers } from '@/stores/searchUsers';
import { useUi } from '@/stores/ui';
import { useNewMessage } from '@/stores/newMessage';
import { useConversations } from '@/stores/conversations';
import { useMessages } from '@/stores/messages';

const mainFocus = ref(null);

const storeUi = useUi();
const { closeNewMessageModal } = storeUi;
const { loadingNewMessageModal } = storeToRefs(storeUi)

const storeSearch = useSearchUsers();
const { query, results } = storeToRefs(storeSearch)
const { handleSearch } = storeSearch;
const storeNewMessage = useNewMessage();
const storeConversations = useConversations();
const storeMessages = useMessages();

async function searchSubmit() {
    storeUi.toggleLoadingNewMessageModal()
    await handleSearch()
    storeUi.toggleLoadingNewMessageModal()
}

function handleNewConversation(selectedUsers) {
    if (selectedUsers.length > 0) {
        // Required: only supports 1-2-1 conversations
        const [user, ...rest] = selectedUsers;
        storeConversations.new(user)

        // Clean up states
        closeNewMessageModal();
        storeMessages.reset();
        storeNewMessage.reset();
        storeSearch.reset();
    }
}

onMounted(() => {
    if (mainFocus) {
        mainFocus.value.focus();
    }
})

</script>

<template>
    <Overlay @hide="() => closeNewMessageModal()" :classStr="`flex flex-col h-full`">
        <template #content>
            <header class="p-4 pl-2 border-b-2 border-lightblue">
                <button @click="() => handleNewConversation(storeNewMessage.asArray)"
                    class="rounded-full bg-blue font-bold text-white relative px-4 py-2 right-0 float-right focus:outline-none hover:bg-darkblue">
                    Next
                </button>
                <span class="flex flex-row items-center gap-4">
                    <i @click="() => closeNewMessageModal()"
                        class="fas fa-times text-blue text-2xl rounded-full bg-white p-2 px-3 hover:bg-lightblue"></i>
                    <p class="text-xl font-bold">New message</p>
                </span>
            </header>

            <form class="flex flex-col p-4 border-b-2 border-lighter" @submit.prevent="searchSubmit()">
                <div class="w-full grid grid-col-6 grid-row-1">
                    <i
                        class="fas fa-search col-start-1 col-span-1 z-1 pl-4 row-start-1 text-xl text-light self-center"></i>
                    <label for="search-for-people" class="hidden">Search for people input</label>
                    <input ref="mainFocus"
                        class="pl-12 col-start-1 col-span-6 row-start-1 rounded-full w-full p-4 bg-lighter text-m focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue"
                        placeholder="Search People" name="search-for-people" id="search-for-people" type="search"
                        v-model="query" />
                </div>
            </form>

            <ul v-if="storeNewMessage.selectedUsers && storeNewMessage.selectedUsers.size > 0"
                class="overflow-x-auto overflow-y-hidden w-full p-4 py-6 border-b-2 border-lighter flex gap-2 list-none items-center">
                <li v-for="[id, user] in storeNewMessage.selectedUsers" :key="id"
                    class="h-12 flex p-2 border-blue rounded-full border-2 gap-2 items-center">
                    <Image :src="user.imgUrl" :classStr="`size-8 rounded-full flex-none`" />
                    <p class="truncate">{{ user.screenName }}</p>
                    <i @click="storeNewMessage.removeUser(user)"
                        class="h-fit fas fa-times text-xl text-blue text-center cursor-pointer"></i>
                </li>
            </ul>
            <Loader v-if="loadingNewMessageModal" />
            <section v-if="!loadingNewMessageModal && results && results.length === 0"
                class="w-full pt-8 p-16 row-start-3">
                <p class="font-bold text-lg">No results for "{{ query }}"</p>
                <p class="text-sm text-dark">The query you entered did not bring up any results.</p>

            </section>
            <NewMessageResults />
        </template>
    </Overlay>
</template>