<script setup>
import { useRouter } from 'vue-router';
import { debounce } from '@/utils/timing';
import * as Routes from '../../router/routeNames';
import { ulid } from 'ulid'
import { ref } from 'vue';

const router = useRouter();
const query = defineModel('');
const searchModes = {
    people: 'People',
    latest: 'Latest'
}
const mode = ref(searchModes.latest)

const SUBMIT_DELAY = 700

const handleSearch = debounce(() => {
    router.push({
        name: Routes.Search,
        query: {
            q: query.value,
            m: mode.value,
            h: ulid()
        }
    })
}, SUBMIT_DELAY)

</script>

<template>
    <section class="relative">
        <i class="fas fa-search absolute mt-3 ml-4 text-sm text-light"></i>
        <label for="search-field"></label>
        <input id="search-field" v-on:keyup="handleSearch" v-model="query"
            class="pl-10 rounded-full w-full p-2 bg-lighter text-sm" placeholder="Search Tweet" />
    </section>
</template>