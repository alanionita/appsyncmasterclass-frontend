<script setup>
import { defineModel, defineProps } from 'vue';

const model = defineModel();

defineProps({
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
})


</script>

<template>
  <label for="name" class="text-dark">{{ label }}</label>
  <input v-model="model" id="name" name="name" class="w-full bg-lightblue text-lg" type="text">
</template>

<style scoped></style>
