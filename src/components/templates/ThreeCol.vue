<script setup>
import SideNav from '@/components/organisms/SideNav.vue'
import DefaultRightBar from '@/components/organisms/DefaultRightBar.vue';

</script>

<template>
  <main class="flex container h-screen w-screen m-auto gap-4 p-4">
    <section class="flex-1/12 lg:flex-3/12 flex flex-col">
      <SideNav />
    </section>
    <section class="flex-11/12 lg:flex-6/12 flex flex-col">
      <slot name="middle"></slot>
    </section>
    <section class="hidden md:flex md:flex-col md:flex-3/12">
      <DefaultRightBar />
    </section>
  </main>
</template>
