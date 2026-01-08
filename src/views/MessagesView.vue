<script setup>
import Loader from '@/components/atoms/Loader.vue';
import ConversationsList from '@/components/molecules/ConversationsList.vue';
import MessagesList from '@/components/molecules/MessagesList.vue';
import NewMessageOverlay from '@/components/organisms/NewMessageOverlay.vue';
import TwoColTemplate from '@/components/templates/TwoCol.vue';
import { useConversations } from '@/stores/conversations';
import { useUi } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const storeUi = useUi();
const storeConversations = useConversations();
const { loading, newMessageModal } = storeToRefs(storeUi)

onMounted(async () => {
  await storeConversations.list();
})

</script>

<template>
  <TwoColTemplate>
    <div class="grid grid-cols-12 auto-cols-fr auto-rows-fr w-full h-full overflow-hidden">
      <!-- LEFT COLUMN -->
      <section class="col-span-5 h-full border-r border-lighter">
        <header class="p-4 border-b border-lighter flex items-center gap-4">
          <h1 class="text-xl font-bold flex-1">Messages</h1>
          <i class="fas fa-cog text-xl text-blue cursor-pointer"></i>
          <i @click="storeUi.openNewMessageModal()" class="fas fa-plus-circle text-xl text-blue cursor-pointer"></i>
        </header>
        <Loader v-if="loading" />
        <ConversationsList v-else />
      </section>
      <!-- RIGHT COLUMN -->
      <section class="col-span-7 h-full border-r border-lighter">
        <MessagesList />
      </section>
    </div>
    <NewMessageOverlay v-if="newMessageModal" />
  </TwoColTemplate>
</template>