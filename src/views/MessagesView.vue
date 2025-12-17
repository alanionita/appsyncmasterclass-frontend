<script setup>
import Loader from '@/components/atoms/Loader.vue';
import ConversationsList from '@/components/molecules/ConversationsList.vue';
import TwoColTemplate from '@/components/templates/TwoCol.vue';
import { useMessages } from '@/stores/messages';
import { useUi } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const message = ref('');
const showNewMessageModal = ref(false);
const lastNextToken = ref(null)
const messages = ref([])

const storeUi = useUi();
const storeMessages = useMessages();
const { loading } = storeToRefs(storeUi)

function newMessage() { }


function isMyMessage() { }

onMounted(async () => {
  await storeMessages.list();
})

</script>

<template>
  <TwoColTemplate>
    <div class="grid grid-cols-12 auto-cols-fr auto-rows-fr w-full h-screen overflow-hidden">
      <!-- LEFT COLUMN -->
      <section class="col-span-4 border-r border-lighter">
        <header class="p-4 border-b border-lighter flex items-center gap-4" @click="deselectAll()">
          <h1 class="text-xl font-bold flex-1">Messages</h1>
          <i class="fas fa-cog text-xl text-blue cursor-pointer"></i>
          <i @click="newMessage()" class="fas fa-plus-circle text-xl text-blue cursor-pointer"></i>
        </header>
        <Loader v-if="loading" />
        <ConversationsList v-else />
      </section>
      <!-- RIGHT COLUMN -->
      <section class="col-span-8 h-full border-r border-lighter"">
        <div class="w-full pt-5 overflow-y-auto">
          <div class="w-full px-5 flex flex-col justify-between">
            <div class="flex flex-col-reverse mt-1 h-full">
              <div ref="scrollToMe"></div>
              <div class="flex flex-col items-center justify-center w-full h-250">
                <div class="w-3/5">
                  <p class="font-bold text-lg">You don't have a message selected</p>
                  <p class="text-sm text-dark">This is where you’ll see messages from people you don’t follow. They
                    won’t know you’ve seen the request until you accept it.</p>
                  <div class="flex justify-start mt-5">
                    <button @click="newMessage()" type="button"
                      class="h-10 px-2 text-white font-semibold bg-blue hover:bg-darkblue rounded-full">
                      New Message
                    </button>
                  </div>
                </div>
              </div>
              <div v-for="message in messages" :key="message.id">
                <!-- Me -->
                <div v-if="isMyMessage(message.from.screenName)">
                  <div class="flex justify-end">
                    <div class="mr-2 py-3 px-4 bg-blue rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                      {{ message.message }}
                    </div>
                  </div>
                  <div class="flex justify-end w-full mb-4">
                    <p class="text-xs text-dark mr-2">{{ message.timestamp | time }}</p>
                  </div>
                </div>
                <!-- Other -->
                <div v-if="!isMyMessage(message.from.screenName)">
                  <div class="flex justify-start">
                    <div class="flex-none mr-4">
                      <a :href="`#/${message.from.screenName}`">
                        <img :src="`${message.from.imageUrl || 'default_profile.png'}`"
                          class="object-cover h-8 w-8 rounded-full self-end" />
                      </a>
                    </div>
                    <div class="ml-2 py-3 px-4 bg-lighter rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-black">
                      {{ message.message }}
                    </div>
                  </div>
                  <div class="flex items-center w-full mb-4">
                    <p class="text-xs text-dark ml-14">{{ message.timestamp | time }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </TwoColTemplate>
</template>