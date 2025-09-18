<script setup>
import User from './User.vue';

const { users } = defineProps(['users']);

</script>

<template>
    <section class="py-4">
        <span v-if="!users || users.length === 0" class="text-xl">No results</span>
        <ul role="list" class="list-none" v-bind:key="user.id" v-for="user in users">
            <User :user="user" />
        </ul>
    </section>
</template>
