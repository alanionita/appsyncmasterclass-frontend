<script setup>
import { useRoute } from 'vue-router';
import ThreeColTemplate from '@/components/templates/ThreeCol.vue';

const route = useRoute()

</script>

<template>
    <ThreeColTemplate>
        <template #middle>
            <p>q: {{ $route.query.q }}</p>
            <p>m: {{ $route.query.m }}</p>
            <p>h: {{ $route.query.h }}</p>
        </template>
    </ThreeColTemplate>
</template>