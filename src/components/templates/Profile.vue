<script setup>
import ProfileHeader from '../molecules/ProfileHeader.vue';
import ProfileDetails from '../molecules/ProfileDetails.vue';
import ProfileHeaderActions from '../molecules/ProfileHeaderActions.vue';

const { myProfile, profile } = defineProps(['myProfile', 'profile'])

</script>

<template>
  <ProfileHeader :name="profile.name" :tweetsCount="profile.tweetsCount" :bgImgUrl="profile.bgImgUrl" />
  <section class="px-4 flex flex-col">
    <ProfileHeaderActions :img-url="profile.imgUrl" :my-profile="myProfile" :following="profile.following" />
    <ProfileDetails :name="profile.name" :screen-name="profile.screenName" :bio="profile.bio"
      :location="profile.location" :website="profile.website" :joined-date="profile.joinedDate"
      :followers-count="profile.followersCount" :following-count="profile.followingCount" />
  </section>
</template>