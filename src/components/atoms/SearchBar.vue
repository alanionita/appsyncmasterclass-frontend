<script setup>
import { useRouter } from 'vue-router';
import { debounce } from '@/utils/timing';
import { SEARCH_MODES, SUBMIT_DELAY } from '@/utils/constants';
import * as Routes from '../../router/routeNames';
import { ulid } from 'ulid'
import { ref } from 'vue';

const router = useRouter();
const query = defineModel('');

const mode = ref(SEARCH_MODES.latest)

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
        <label class="hidden" for="search-field">Search tweets</label>
        <input id="search-field" v-on:keyup.enter="handleSearch" v-model="query"
            class="pl-10 rounded-full w-full p-2 bg-lighter text-sm" placeholder="Search Tweet" />
    </section>
</template>