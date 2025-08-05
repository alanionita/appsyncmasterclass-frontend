<script setup>

const { imgUrl, myProfile, following, toggleEditProfile, toggleSetupProfile } = defineProps(['imgUrl', 'myProfile', 'following', 'toggleSetupProfile', 'toggleEditProfile'])

</script>

<template>
    <section class="flex flex-row justify-between">
        <img :src="imgUrl" class="size-32 rounded-full border-white border-4" style="margin-top:-80px" />

        <!-- My Profile Actions -->
        <section v-if="myProfile" class="flex gap-4 py-4">
            <button v-if="imgUrl === null || imgUrl === 'default_profile.png'" @click.prevent="toggleSetupProfile"
                class="ml-auto text-blue font-bold px-4 py-2 rounded-full border border-blue hover:bg-lightblue">
                Set up profile
            </button>
            <button v-if="imgUrl !== null && imgUrl !== 'default_profile.png'" @click.prevent="toggleEditProfile"
                class="ml-auto text-blue font-bold px-4 py-2 rounded-full border border-blue hover:bg-lightblue">
                Edit profile
            </button>
        </section>

        <!-- Their Profile Actions -->
        <section v-if="!myProfile" class="flex gap-4 py-4">
            <button class="text-blue font-bold px-4 py-3 rounded-full border border-blue hover:bg-lightblue">
                <i class="fas fa-ellipsis-h"></i>
            </button>
            <button class="text-blue font-bold px-4 py-3 rounded-full border border-blue hover:bg-lightblue">
                <i class="fas fa-envelope"></i>
            </button>
            <button v-if="!following"
                class="text-blue font-bold px-4 py-3 rounded-full border border-blue hover:bg-lightblue">
                Follow
            </button>
            <button v-if="following" @mouseover="followingLabel = 'Unfollow'" @mouseleave="followingLabel = 'Following'"
                class="text-white bg-blue font-bold px-4 py-3 rounded-full border hover:bg-red-700">
                {{ followingLabel }}
            </button>
        </section>
    </section>
</template>