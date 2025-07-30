<script setup>
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';

const profile = useTwitterMyProfile()

</script>

<template>
    <section class="flex gap-4 py-4 border-b border-lighter items-center">
        <button class="rounded-full p-3 px-4 focus:outline-none hover:bg-lightblue">
          <i class="fas fa-arrow-left text-blue"></i>
        </button>
        <div class="lg:block">
          <h1 class="text-xl font-bold">{{ profile.name }}</h1>
          <p class="text-left text-sm leading-tight text-dark">{{ profile.tweetsCount }} Tweets</p>
        </div>
      </section>

      <!-- background image -->
      <section class="border-b-1 border-lighter fl  ex" style="height:240px; display:block">
        <figure v-if="profile.backgroundImageUrl" class="h-full max-h-full">
          <img :src="profile.backgroundImageUrl" class="h-full w-full object-cover" />
        </figure>
        <figure v-if="!profile.backgroundImageUrl" class="bg-gray-400 h-full max-h-full">
        </figure>
      </section>

      <!-- profile details -->
      <section class="px-4 flex flex-col">
        <section class="flex flex-row justify-between">
          <img :src="profile.imgUrl" class="size-32 rounded-full border-white border-4" style="margin-top:-80px" />

          <section class="flex gap-4 py-4">
            <button v-if="profile.imgUrl === null || profile.imgUrl === 'default_profile.png'"
              class="ml-auto text-blue font-bold px-4 py-2 rounded-full border border-blue hover:bg-lightblue">
              Set up profile
            </button>
            <button v-if="profile.imgUrl !== null && profile.imgUrl !== 'default_profile.png'"
              class="ml-auto text-blue font-bold px-4 py-2 rounded-full border border-blue hover:bg-lightblue">
              Edit profile
            </button>
          </section>
        </section>
        <section class="flex flex-col gap-4">
          <section class="flex flex-col gap-1">
            <p class="font-bold text-xl">{{ profile.name }}</p>
            <p class="text-dark">@{{ profile.screenName }}</p>
          </section>
          <p>{{ profile.bio }}</p>
          <section class="flex flex-row gap-4">
            <div v-if="profile.location" class="flex flex-row gap-2">
              <i class="fas fa-map-marker-alt text-dark align-text-bottom"></i>
              <p class="text-dark">{{ profile.location }}</p>
            </div>
            <div v-if="profile.website" class="flex flex-row gap-2">
              <i class="fas fa-link text-dark align-text-bottom"></i>
              <a :href="`${profile.website}`" target="_blank" class="text-dark">{{ profile.website.replace('https://',
                '').replace('http://', '') }}</a>
            </div>
            <div class="flex flex-row gap-2">
              <i class="far fa-calendar-alt text-dark align-text-bottom"></i>
              <p class="text-dark">Joined {{ profile.joinedDate }}</p>
            </div>
          </section>
          <section class="flex flex-row gap-8">
            <button class="flex flex-row hover:underline">
              <span class="font-bold">{{ profile.followingCount }}</span>
              <span class="text-dark whitespace-pre"> Following</span>
            </button>
            <button class="flex flex-row hover:underline">
              <span class="font-bold">{{ profile.followersCount }}</span>
              <span class="text-dark whitespace-pre"> Followers</span>
            </button>
          </section>
        </section>
      </section>
</template>