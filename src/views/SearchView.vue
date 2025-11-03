<script setup>
import { useRoute, useRouter } from 'vue-router';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';
import { onMounted } from 'vue';
import { ulid } from 'ulid';
import { debounce } from '@/utils/timing';
import { SUBMIT_DELAY, SEARCH_MODES, ROUTE_NAMES } from '@/utils/constants';

const route = useRoute()
const router = useRouter()
const query = defineModel("query", {
    default: ""
})
const mode = defineModel("mode", {
    default: SEARCH_MODES.latest
})

const handleSearch = debounce(() => {
    router.push({
        name: ROUTE_NAMES.Search,
        query: {
            q: query.value,
            m: mode.value,
            h: ulid()
        }
    })
}, SUBMIT_DELAY)

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
                    <a @click="gotoHome()" class="rounded-full md:pr-2 focus:outline-none hover:bg-lightblue">
                        <i class="fas fa-arrow-left text-blue"></i>
                    </a>
                    <section class="lg:block ml-4 w-full">
                        <i class="fas fa-search absolute mt-3 ml-5 text-m text-light"></i>
                        <label class="hidden" for="search-field">Search tweets</label>
                        <input
                            id="search-field"
                            class="pl-12 rounded-full w-full p-2 bg-lighter text-m focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue"
                            placeholder="Search Twitter" 
                            type="search" 
                            v-model="query"
                            v-on:keyup.enter="handleSearch()" />
                    </section>
                </div>
                <section>
                    <p>q: {{ $route.query.q }}</p>
                    <p>m: {{ $route.query.m }}</p>
                    <p>h: {{ $route.query.h }}</p>
                </section>

            </section>
        </template>
    </ThreeColTemplate>
</template>