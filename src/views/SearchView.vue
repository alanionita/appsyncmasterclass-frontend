<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useSearch } from '@/stores/search';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { SEARCH_MODES } from '@/utils/constants';

const router = useRouter();
const route = useRoute()
const storeSearch = useSearch();
const { query, mode } = storeToRefs(storeSearch)
const { handleSearch, changeMode } = storeSearch;

onMounted(() => {
    if (route.query && route.query.q) {
        query.value = route.query.q
    }
    if (route.query && route.query.m) {
        mode.value = route.query.m
    }
})

</script>

<template>
    <ThreeColTemplate>
        <template #middle>
            <section class="flex flex-col gap-8 py-4">
                <div class=" border-lighter flex items-center">
                    <a href="/" class="rounded-full md:pr-2 focus:outline-none hover:bg-lightblue">
                        <i class="fas fa-arrow-left text-blue"></i>
                    </a>
                    <section class="lg:block ml-4 w-full">
                        <i class="fas fa-search absolute mt-3 ml-5 text-m text-light"></i>
                        <label class="hidden" for="search-field">Search tweets</label>
                        <input id="search-field"
                            class="pl-12 rounded-full w-full p-2 bg-lighter text-m focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue"
                            placeholder="Search Twitter" type="search" v-model="query"
                            v-on:keyup.enter="handleSearch(router)" />
                    </section>
                </div>
                <section class="grid grid-rows-1 grid-cols-5">
                    <button
                        class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-8 md:py-4 hover:bg-lightblue">Top</button>
                    <button @click="changeMode(router, SEARCH_MODES.latest)"
                        class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue"
                        :class="`${mode == SEARCH_MODES.latest ? 'border-blue' : ''}`">{{ SEARCH_MODES.latest }}</button>
                    <button @click="changeMode(router, SEARCH_MODES.people)"
                        class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue"
                        :class="`${mode == SEARCH_MODES.people ? 'border-blue' : ''}`">{{ SEARCH_MODES.people }}</button>
                    <button
                        class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue">Photos</button>
                    <button
                        class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue">Videos</button>
                </section>
                <section>
                    <p>q: {{ $route.query.q }}</p>
                    <p>m: {{ $route.query.m }}</p>
                    <p>h: {{ $route.query.h }}</p>
                </section>

            </section>
        </template>
    </ThreeColTemplate>
</template>