<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as Routes from '../../router/routeNames'
import UsersList from '../molecules/UsersList.vue';

const router = useRouter();
const route = useRoute();
const { profileName, profileScreenName, list } = defineProps(['profile', 'profile-name', 'profile-screen-name', 'list'])
const screenName = route.params.screenName

const tabs = ref(['Following', 'Followers'])

/** Navigates to the neighbouring list 
 * @summary Navigates to corresponding list
 * @param route - String of ['Profile', 'Following', 'Followers']
 * */

function goTo(route) {
    router.push({
        name: Routes[route],
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

    <UsersList :users="list" />
</template>