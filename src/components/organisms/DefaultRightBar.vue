<script setup>
import SearchBar from '../atoms/SearchBar.vue';
import TrendingForYou from '../molecules/TrendingForYou.vue';
import WhoToFollow from '../molecules/WhoToFollow.vue';


</script>

<template>
  <section class="md:flex-col gap-4 hidden md:flex h-full border-l border-lighter p-4 overflow-y-auto relative min-w-max">
    <SearchBar/>
    <TrendingForYou/>
    <WhoToFollow/>
  </section>
</template>