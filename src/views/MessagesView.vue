<script setup>
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';

</script>

<template>
  <ThreeColTemplate :trending="false" :follow-who="false" :search="false">
    <template #middle>
      <h1>Messages</h1>
    </template>
  </ThreeColTemplate>
</template>