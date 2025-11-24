<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UsersList from '../molecules/UsersList.vue';
import Loader from '../atoms/Loader.vue';
import { storeToRefs } from 'pinia';
import { useUi } from '@/stores/ui';
import { ROUTE_NAMES } from '@/utils/constants';

const router = useRouter();
const route = useRoute();
const uiStore = useUi();
const { loading } = storeToRefs(uiStore)
const { profileName, profileScreenName, list } = defineProps(['profile', 'profile-name', 'profile-screen-name', 'list'])
const screenName = route.params.screenName

const tabs = ref(['Following', 'Followers'])

/** Navigates to the neighbouring list 
 * @summary Navigates to corresponding list
 * @param route - String of ['Profile', 'Following', 'Followers']
 * */

function goTo(route) {
    router.push({
        name: ROUTE_NAMES[route],
        params: {
            screenName
        }
    })
}

</script>

<template>

    <div class="py-2 flex items-center">
        <button @click="goTo('Profile')" class="rounded-full p-3 px-4 focus:outline-none hover:bg-lightblue">
            <i class="fas fa-arrow-left text-blue"></i>
        </button>
        <div class="lg:block ml-4">
            <h1 class="text-xl font-bold">{{ profileName }}</h1>
            <p class="text-left text-sm leading-tight text-dark">@{{ profileScreenName }}</p>
        </div>
    </div>

    <ul class="flex flex-row justify-evenly mt-2 list-none" role="tablist">
        <li v-for="(tab) in tabs" class="w-1/2 font-bold " role="presentation">
            <button @click="goTo(tab)" role="tab" :aria-selected="route.name === tab && true"
                class="w-full px-8 py-4 text-dark aria-selected:text-blue aria-selected:bg-lightblue aria-selected:border-blue font-bold border-b-2 border-lighter hover:bg-lightblue">{{
                    tab }}</button>
        </li>
    </ul>

    <Loader v-if="loading"/>
    <UsersList v-if="!loading" :users="list" />
</template>