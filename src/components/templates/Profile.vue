<script setup>
import ProfileHeader from '../molecules/ProfileHeader.vue';
import ProfileDetails from '../molecules/ProfileDetails.vue';
import ProfileHeaderActions from '../molecules/ProfileHeaderActions.vue';
import Timeline from '../molecules/Timeline.vue';

const { myProfile, profile, tweets } = defineProps(['myProfile', 'profile', 'tweets']);

</script>

<template>
  <ProfileHeader :name="profile.name" :tweetsCount="profile.tweetsCount" :bgImgUrl="profile.bgImgUrl" />
  <section class="px-4 flex flex-col">
    <ProfileHeaderActions :img-url="profile.imgUrl" :my-profile="myProfile" :following="profile.following" />
    <ProfileDetails :name="profile.name" :screen-name="profile.screenName" :bio="profile.bio"
      :location="profile.location" :website="profile.website" :joined-date="profile.joinedDate"
      :followers-count="profile.followersCount" :following-count="profile.followingCount" />
    <div class="flex flex-row justify-between pt-4">
      <button class="grow text-dark font-bold border-b-2 border-blue px-10 py-4 hover:bg-lightblue">Tweets</button>
      <button class="grow text-dark font-bold border-b-2 border-lighter px-10 py-4 hover:bg-lightblue">Tweets & replies</button>
      <button class="grow text-dark font-bold border-b-2 border-lighter px-10 py-4 hover:bg-lightblue">Media</button>
      <button class="grow text-dark font-bold border-b-2 border-lighter px-10 py-4 hover:bg-lightblue">Like</button>
    </div>
    <Timeline :tweets="tweets" />
  </section>
</template>