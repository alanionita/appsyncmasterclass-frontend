<script setup>
import Loader from '@/components/atoms/Loader.vue';
import ConversationsList from '@/components/molecules/ConversationsList.vue';
import MessagesList from '@/components/molecules/MessagesList.vue';
import TwoColTemplate from '@/components/templates/TwoCol.vue';
import { useMessages } from '@/stores/messages';
import { useUi } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const message = ref('');
const showNewMessageModal = ref(false);
const lastNextToken = ref(null)

const storeUi = useUi();
const storeMessages = useMessages();
const { loading } = storeToRefs(storeUi)

function newMessage() { }

onMounted(async () => {
  await storeMessages.list();
})

</script>

<template>
  <TwoColTemplate>
    <div class="grid grid-cols-12 auto-cols-fr auto-rows-fr w-full h-full overflow-hidden">
      <!-- LEFT COLUMN -->
      <section class="col-span-5 h-full border-r border-lighter">
        <header class="p-4 border-b border-lighter flex items-center gap-4" @click="deselectAll()">
          <h1 class="text-xl font-bold flex-1">Messages</h1>
          <i class="fas fa-cog text-xl text-blue cursor-pointer"></i>
          <i @click="newMessage()" class="fas fa-plus-circle text-xl text-blue cursor-pointer"></i>
        </header>
        <Loader v-if="loading" />
        <ConversationsList v-else />
      </section>
      <!-- RIGHT COLUMN -->
      <section class="col-span-7 h-full border-r border-lighter">
        <MessagesList />
      </section>
    </div>
  </TwoColTemplate>
</template>