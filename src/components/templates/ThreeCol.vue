<script setup>
import SideNav from '@/components/organisms/SideNav.vue'
import DefaultRightBar from '@/components/organisms/DefaultRightBar.vue';

const { trending, followWho, search } = defineProps(['trending', 'follow-who', 'search'])

</script>

<template>
  <main class="flex md:container h-screen w-screen md:m-auto">
    <section class="flex-none w-16 md:flex-3/12 lg:flex-3/12 flex flex-col justify-center">
      <SideNav />
    </section>
    <section class="flex-11/12 lg:flex-6/12 flex flex-col">
      <slot name="middle"></slot>
    </section>
    <section class="hidden md:flex md:flex-col md:flex-3/12">
      <DefaultRightBar :trending="trending" :followWho="followWho" :search="search"/>
    </section>
  </main>
</template>
