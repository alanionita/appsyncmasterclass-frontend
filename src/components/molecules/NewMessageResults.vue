<script setup>
import { useSearchUsers } from '@/stores/searchUsers';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { storeToRefs } from 'pinia'
import Image from '../atoms/Image.vue';
import LinkifyText from '../atoms/LinkifyText.vue';
import { useNewMessage } from '@/stores/newMessage';

const myProfile = useTwitterMyProfile();
const storeSearch = useSearchUsers()
const { results } = storeToRefs(storeSearch)
const { selectUser, selectedUserExists } = useNewMessage();

</script>
<template>
  <ul role="list" class="list-none h-full overflow-auto">
    <template v-for="user in results" v-bind:key="user.id">
      <li v-if="myProfile.id !== user.id && user.screenName" @click="selectUser(user)"
        class="grid grid-cols-(--grid-cols-6-avatar) grid-rows-1 w-full p-4 border-b border-lighter hover:bg-lightest cursor-pointer">
        <figure class="col-start-0 col-span-1 self-center">
          <Image :src="user.imgUrl" :class-str="`h-12 w-12 rounded-full`" />
        </figure>
        <section class="col-start-2 col-span-4">
          <span>
            <p class="font-bold">{{ user.name }}</p>
            <p class="text-dark text-sm">@{{ user.screenName }}</p>
          </span>
          <LinkifyText :text="user.bio" :classStr="`w-auto`" />
        </section>
        <figure
          class="col-start-7 h-auto resize-both overflow-hidden self-center items-end">
          <i :data-selected="selectedUserExists(user.id)" 
            class="fas fa-circle-check text-lighter text-xl data-[selected=true]:text-blue"></i>
        </figure>
      </li>
    </template>
  </ul>
</template>
