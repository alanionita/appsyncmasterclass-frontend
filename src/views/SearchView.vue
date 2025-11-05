<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useSearch } from '@/stores/search';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { SEARCH_MODES } from '@/utils/constants';
import { vScrollend } from '@/directives';
import Loader from '@/components/atoms/Loader.vue';
import { useUi } from '@/stores/ui';
import SearchResults from '@/components/molecules/SearchResults.vue';

const router = useRouter();
const route = useRoute()
const storeSearch = useSearch();
const storeUi = useUi()
const { query, mode, results } = storeToRefs(storeSearch)
const { handleSearch, changeMode, loadMore, reset, firstLoad } = storeSearch;
const { loading } = storeToRefs(storeUi);

async function searchSubmit() {
    storeUi.loadingOn()
    reset()
    await handleSearch(router)
    storeUi.loadingOff()
}

onMounted(() => {
    if (route.query && route.query.q) {
        query.value = route.query.q
    }
    if (route.query && route.query.m) {
        mode.value = route.query.m
    }
    if (firstLoad) {
        console.log('here2')
        searchSubmit()
        return;
    }
})

</script>

<template>
    <ThreeColTemplate>
        <template #middle>
            <section class="flex flex-col gap-4 py-4 overflow-y-auto" v-scrollend:bottom="() => loadMore()">
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
                            v-on:keyup.enter="searchSubmit" />
                    </section>
                </div>
                <section class="grid grid-rows-1 grid-cols-5">
                    <button
                        class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-8 md:py-4 hover:bg-lightblue">Top</button>
                    <button @click="changeMode(router, SEARCH_MODES.latest)"
                        class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue"
                        :class="`${mode == SEARCH_MODES.latest ? 'border-blue' : ''}`">{{ SEARCH_MODES.latest
                        }}</button>
                    <button @click="changeMode(router, SEARCH_MODES.people)"
                        class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue"
                        :class="`${mode == SEARCH_MODES.people ? 'border-blue' : ''}`">{{ SEARCH_MODES.people
                        }}</button>
                    <button
                        class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue">Photos</button>
                    <button
                        class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue">Videos</button>
                </section>
                <section>
                    <Loader v-if="loading" />
                    <div v-if="!loading && results && results.length === 0"
                        class="flex flex-col items-center justify-center w-full p-16">
                        <section>
                            <p class="font-bold text-lg">No results for "{{ query }}"</p>
                            <p class="text-sm text-dark">The term you entered did not bring up any results. You may have
                                mistyped your term or your Search settings could be protecting you from some potentially
                                sensitive content.</p>
                        </section>
                    </div>

                    <SearchResults :results="results" />
                </section>
            </section>
        </template>
    </ThreeColTemplate>
</template>