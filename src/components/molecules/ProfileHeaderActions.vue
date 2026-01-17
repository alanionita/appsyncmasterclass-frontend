<script setup>
import { useUi } from '@/stores/ui';
import FollowButton from '../atoms/FollowButton.vue';
import Image from '../atoms/Image.vue';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '@/utils/constants';

const { toggleEditProfile, toggleSetupProfile, profile } = defineProps(['toggleSetupProfile', 'toggleEditProfile', 'profile'])

const storeUi = useUi();
const router = useRouter()

function handleMessageClick(screenName) {
    router.push({
        name: ROUTE_NAMES.Messages,
        query: {
            screenName
        }
    })
}

</script>

<template>
    <section class="flex flex-row justify-between">
        <!-- Required :key as a reactivity certainty hook -->
        <Image 
            :key="JSON.stringify(profile)"
            :src="profile && profile.imgUrl" 
            :classStr="`size-28 md:size-32 -mt-16 rounded-full border-white border-4`" />
        <!-- My Profile Actions -->
        <section v-if="storeUi.ownProfile" class="flex gap-4 py-4">
            <button v-if="profile.imgUrl === null || profile.imgUrl === 'default_profile.png'" @click.prevent="toggleSetupProfile"
                class="ml-auto text-blue font-bold px-4 py-2 rounded-full border border-blue hover:bg-lightblue">
                Set up profile
            </button>
            <button v-if="profile.imgUrl !== null && profile.imgUrl !== 'default_profile.png'" @click.prevent="toggleEditProfile"
                class="ml-auto text-blue font-bold px-4 py-2 rounded-full border border-blue hover:bg-lightblue">
                Edit profile
            </button>
        </section>

        <!-- Their Profile Actions -->
        <section v-if="!storeUi.ownProfile" class="flex gap-4 py-4">
            <button class="text-blue font-bold px-4 py-3 rounded-full border border-blue hover:bg-lightblue">
                <i class="fas fa-ellipsis-h"></i>
            </button>
            <button
                @click.prevent="() => handleMessageClick(profile.screenName)"
                class="text-blue font-bold px-4 py-3 rounded-full border border-blue hover:bg-lightblue cursor-pointer">
                <i class="fas fa-envelope"></i>
            </button>
            <FollowButton />
        </section>
    </section>
</template>