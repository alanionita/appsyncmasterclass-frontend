<script setup>
import SearchBar from '../atoms/SearchBar.vue';
import TrendingForYou from '../molecules/TrendingForYou.vue';
import WhoToFollow from '../molecules/WhoToFollow.vue';

const { trending, followWho, search } = defineProps(['trending', 'follow-who', 'search'])

</script>

<template>
  <section class="md:flex-col gap-4 hidden md:flex h-full border-l border-lighter p-4 overflow-y-auto relative min-w-max">
    <SearchBar v-if="search"/>
    <TrendingForYou v-if="trending"/>
    <WhoToFollow v-if="followWho"/>
  </section>
</template>