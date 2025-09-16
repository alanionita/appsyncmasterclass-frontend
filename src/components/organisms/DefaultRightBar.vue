<script setup>
import SearchBar from '../atoms/SearchBar.vue';
import TrendingForYou from '../molecules/TrendingForYou.vue';
import WhoToFollow from '../molecules/WhoToFollow.vue';

const { trending, followWho } = defineProps(['trending', 'follow-who'])

</script>

<template>
  <section class="md:flex-col gap-4 hidden md:flex h-full border-l border-lighter p-4 overflow-y-auto relative min-w-max">
    <SearchBar/>
    <TrendingForYou v-if="trending"/>
    <WhoToFollow v-if="followWho"/>
  </section>
</template>