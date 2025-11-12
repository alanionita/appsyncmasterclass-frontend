<script setup>
import ProfileHeader from '../molecules/ProfileHeader.vue';
import ProfileDetails from '../molecules/ProfileDetails.vue';
import ProfileHeaderActions from '../molecules/ProfileHeaderActions.vue';
import Timeline from '../molecules/Timeline.vue';
import { ref } from 'vue';
import EditProfileOverlay from '../organisms/EditProfileOverlay.vue';
import SetupProfileOverlay from '../organisms/SetupProfileOverlay.vue';
import { useUi } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const { profile, tweets } = defineProps(['profile', 'tweets']);
const route = useRoute()
const showEditProfile = ref(false);
const showSetupProfile = ref(false);
const ui = useUi();
const { noProfile } = storeToRefs(ui);

function toggleOverlayFlag(flag) {
  flag.value = !flag.value
}

function toggleEditProfile() {
  toggleOverlayFlag(showEditProfile)
}

function toggleSetupProfile() {
  toggleOverlayFlag(showSetupProfile)
}

</script>

<template>
  <template v-if="noProfile">
    <ProfileHeader :profile="profile" :tweetsCount="profile.tweetsCount" :bgImgUrl="profile.bgImgUrl" />
    <section class="flex flex-col items-center justify-center">
      <div class="w-3/5 flex flex-col items-left mt-10">
        <p class="text-black text-lg">@{{ route.params.screenName }}</p>
        <p class="font-bold text-2xl">This account doesn’t exist</p>
        <p class="text-lg text-dark">Try searching for another.</p>
      </div>
    </section>
  </template>
  <template v-if="!noProfile">
    <ProfileHeader :profile="profile" :tweetsCount="profile.tweetsCount" :bgImgUrl="profile.bgImgUrl" />
    <section class="px-4 flex flex-col">
      <ProfileHeaderActions :profile="profile" :img-url="profile.imgUrl" :toggleSetupProfile="toggleSetupProfile"
        :toggleEditProfile="toggleEditProfile" />
      <ProfileDetails :name="profile.name" :screen-name="profile.screenName" :bio="profile.bio"
        :location="profile.location" :website="profile.website" :joined-date="profile.joinedDate"
        :followers-count="profile.followersCount" :following-count="profile.followingCount" />
      <div class="flex flex-row justify-between pt-4">
        <button class="grow text-dark font-bold border-b-2 border-blue px-10 py-4 hover:bg-lightblue">Tweets</button>
        <button class="grow text-dark font-bold border-b-2 border-lighter px-10 py-4 hover:bg-lightblue">Tweets &
          replies</button>
        <button class="grow text-dark font-bold border-b-2 border-lighter px-10 py-4 hover:bg-lightblue">Media</button>
        <button class="grow text-dark font-bold border-b-2 border-lighter px-10 py-4 hover:bg-lightblue">Like</button>
      </div>
    </section>
    <Timeline v-if="!noProfile" :tweets="tweets" />
    <EditProfileOverlay v-if="showEditProfile" @hide="toggleEditProfile" />
    <SetupProfileOverlay v-if="showSetupProfile" @hide="toggleSetupProfile" />
  </template>
</template>
