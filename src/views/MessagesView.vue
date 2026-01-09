<script setup>
import Loader from '@/components/atoms/Loader.vue';
import ConversationsList from '@/components/molecules/ConversationsList.vue';
import MessagesList from '@/components/molecules/MessagesList.vue';
import NewMessageOverlay from '@/components/organisms/NewMessageOverlay.vue';
import TwoColTemplate from '@/components/templates/TwoCol.vue';
import { useConversations } from '@/stores/conversations';
import { useTwitterTheirProfile } from '@/stores/twitterTheirProfile';
import { useUi } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const storeConversations = useConversations()
const storeTheirProfile = useTwitterTheirProfile()
const route = useRoute()
const storeUi = useUi()
const { loading, newMessageModal } = storeToRefs(storeUi)

async function handleRouteWithQueries() {
  await storeConversations.list();
  const { screenName } = route.query
  
  const urlValid = screenName && storeTheirProfile.screenName === screenName
  
  if (urlValid) {
    const { id, name, screenName, imgUrl } = storeTheirProfile
    storeConversations.new({ id, name, screenName, imgUrl })
  }
}

watch(() => route.query.screenName, handleRouteWithQueries, { immediate: true })

onMounted(async () => {
  await storeConversations.list();
})

</script>

<template>
  <TwoColTemplate>
    <div class="grid grid-cols-12 auto-cols-fr auto-rows-fr w-full h-screen overflow-hidden">
      <!-- LEFT COLUMN -->
      <section class="col-span-5 h-screen border-r border-lighter">
        <header class="p-4 border-b border-lighter flex items-center gap-4">
          <h1 class="text-2xl font-bold flex-1">Messages</h1>
          <i class="fas fa-cog text-xl text-blue cursor-pointer"></i>
          <i @click="storeUi.openNewMessageModal()" class="fas fa-plus-circle text-xl text-blue cursor-pointer"></i>
        </header>
        <Loader v-if="loading" />
        <ConversationsList v-else />
      </section>
      <!-- RIGHT COLUMN -->
      <section class="col-span-7 h-full border-r border-lighter overflow-hidden">
        <MessagesList />
      </section>
    </div>
    <NewMessageOverlay v-if="newMessageModal" />
  </TwoColTemplate>
</template>