<script setup>
import { defineModel, defineProps, ref } from 'vue';

const model = defineModel();
const show = ref(false)

defineProps({
  label: {
    type: String,
    required: true,
  },
})

function toggleShow() {
  show.value = !show.value
}

</script>

<template>
  <label for="password" class="text-dark flex-2/3">{{ label }}</label>
  <div class="flex justify-between items-center pr-4">
    <input v-model="model" id="password" name="password" class="w-full bg-lightblue text-lg flex-1"
      :type="`${show ? 'text' : 'password'}`">
    <i :class="`${show ? 'fa-solid fa-eye-slash text-dark flex-0 text-2xl' : 'fa-solid fa-eye text-dark flex-0 text-2xl'}`"
      @click="toggleShow"></i>
  </div>
</template>

<style scoped></style>
