<script setup>
import SideNav from '@/components/organisms/SideNav.vue'

</script>

<template>
  <main class="flex container h-screen w-screen m-auto gap-4 p-4">
    <section class="flex-1/12 lg:flex-3/12 flex flex-col">
      <SideNav />
    </section>
    <section class="flex-11/12 lg:flex-9/12 flex flex-col">
      <slot></slot>
    </section>
  </main>
</template>
