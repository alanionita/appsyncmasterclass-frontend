<script setup>
import { ref, nextTick } from 'vue';

const model = defineModel();

const inputRef = ref(null);

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

const focus = async () => {
  await nextTick(); // Ensure DOM is updated
  inputRef.value?.focus();
};

defineExpose({ focus });

</script>

<template>
  <label :for="name" class="text-dark">{{ label }}</label>
  <input 
    ref="inputRef"
    :id="name"
    :name="name"
    v-model="model"
    class="w-full bg-lightblue text-lg"
    type="text"
  >
</template>

<style scoped></style>
