<script setup>
import { useUi } from '@/stores/ui';
import FollowButton from '../atoms/FollowButton.vue';

const { imgUrl, toggleEditProfile, toggleSetupProfile, profile } = defineProps(['imgUrl', 'toggleSetupProfile', 'toggleEditProfile', 'profile'])

const storeUi = useUi()

async function handleImageError() {
    if (profile) {
        await profile.imgUrlSigned;
    }
}

</script>

<template>
    <section class="flex flex-row justify-between">
        <img :src="imgUrl" @error="handleImageError" class="size-32 rounded-full border-white border-4"
            style="margin-top:-80px" />

        <!-- My Profile Actions -->
        <section v-if="storeUi.ownProfile" class="flex gap-4 py-4">
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
        <section v-if="!storeUi.ownProfile" class="flex gap-4 py-4">
            <button class="text-blue font-bold px-4 py-3 rounded-full border border-blue hover:bg-lightblue">
                <i class="fas fa-ellipsis-h"></i>
            </button>
            <button class="text-blue font-bold px-4 py-3 rounded-full border border-blue hover:bg-lightblue">
                <i class="fas fa-envelope"></i>
            </button>
            <FollowButton />
        </section>
    </section>
</template>