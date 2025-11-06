<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import ThreeColTemplate from '@/components/templates/ThreeCol.vue'
import { SEARCH_MODES } from '@/utils/constants'
import Loader from '@/components/atoms/Loader.vue'
import { useUi } from '@/stores/ui'
import SearchHastagResults from '@/components/molecules/SearchHashtagResults.vue'

const route = useRoute()
const storeUi = useUi()
const { loading } = storeToRefs(storeUi)

const query = defineModel('query', {
  default: '',
})

const mode = defineModel('mode', {
  default: SEARCH_MODES.latest,
})

const results = defineModel('results', {
  default: [],
})

async function searchSubmit() {}

function changeMode() {}

onMounted(() => {
  if (route.query && route.query.q) {
    query.value = route.query.q
  }
  if (route.query && route.query.m) {
    mode.value = route.query.m
  }
  storeUi.loadingOff()
})
</script>

<template>
  <ThreeColTemplate>
    <template #middle>
      <section class="flex flex-col gap-4 py-4 overflow-y-auto">
        <div class="border-lighter flex items-center">
          <a href="/" class="rounded-full md:pr-2 focus:outline-none hover:bg-lightblue">
            <i class="fas fa-arrow-left text-blue"></i>
          </a>
          <section class="lg:block ml-4 w-full">
            <i class="fas fa-search absolute mt-3 ml-5 text-m text-light"></i>
            <label class="hidden" for="search-field">Search Twitter</label>
            <input
              id="search-field"
              class="pl-12 rounded-full w-full p-2 bg-lighter text-m focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue"
              placeholder="Search Twitter"
              type="search"
              v-model="query"
              v-on:keyup.enter="searchSubmit"
            />
          </section>
        </div>
        <section class="grid grid-rows-1 grid-cols-5">
          <button
            class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-8 md:py-4 hover:bg-lightblue"
          >
            Top
          </button>
          <button
            @click="changeMode(router, SEARCH_MODES.latest)"
            class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue"
            :class="`${mode == SEARCH_MODES.latest ? 'border-blue' : ''}`"
          >
            {{ SEARCH_MODES.latest }}
          </button>
          <button
            @click="changeMode(router, SEARCH_MODES.people)"
            class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue"
            :class="`${mode == SEARCH_MODES.people ? 'border-blue' : ''}`"
          >
            {{ SEARCH_MODES.people }}
          </button>
          <button
            class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue"
          >
            Photos
          </button>
          <button
            class="col-span-1 row-span-1 text-dark font-bold border-b-2 md:px-5 md:py-4 hover:bg-lightblue"
          >
            Videos
          </button>
        </section>
        <section>
          <Loader v-if="loading" />
          <div
            v-if="!loading && results && results.length === 0"
            class="flex flex-col items-center justify-center w-full p-16"
          >
            <section>
              <p class="font-bold text-lg">No results for "{{ query }}"</p>
              <p class="text-sm text-dark">
                The term you entered did not bring up any results. You may have mistyped your term
                or your Search settings could be protecting you from some potentially sensitive
                content.
              </p>
            </section>
          </div>

          <SearchHastagResults v-if="!loading && results && results.length > 0" results="results" />
        </section>
      </section>
    </template>
  </ThreeColTemplate>
</template>
