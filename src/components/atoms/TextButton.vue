<script setup>
const props = defineProps(['text', 'action'])

</script>

<template>
    <button
        class="flex justify-center items-center text-white bg-blue rounded-full font-semibold h-12 lg:h-auto lg:w-auto p-4 hover:bg-darkblue">
        <p class="hidden lg:block lg:pl-2">{{ props.text }}</p>
        <i class="fas fa-plus lg:invisible"></i>
    </button>
</template>