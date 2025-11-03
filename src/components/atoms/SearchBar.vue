<script setup>
import { useRouter } from 'vue-router';
import { useSearch } from '@/stores/search';
import { storeToRefs } from 'pinia';

const router = useRouter();
const storeSearch = useSearch();
const { query } = storeToRefs(storeSearch)

</script>

<template>
    <section class="relative">
        <i class="fas fa-search absolute mt-3 ml-4 text-sm text-light"></i>
        <label class="hidden" for="search-field">Search tweets</label>
        <input id="search-field" v-on:keyup.enter="storeSearch.handleSearch(router)" v-model="query"
            class="pl-10 rounded-full w-full p-2 bg-lighter text-sm" placeholder="Search Tweet" />
    </section>
</template>