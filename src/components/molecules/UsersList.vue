<script setup>
import User from './User.vue';

const { users } = defineProps(['users']);

</script>

<template>
    <section class="h-fit">
        <div v-if="!users || users.length === 0" 
            class="grid grid-cols-12 grid-rows-1 w-full p-4 gap-2 border-b border-lighter text-xl font-bold">
            <section class="col-start-1 col-span-12 h-16 flex items-center">
                <p class="align-middle">No results</p>
            </section>
        </div>
        <ul v-if="users && users.length > 0" 
            v-for="user in users"
            v-bind:key="user.id" 
            role="list" 
            class="list-none">
            <User :user="user" />
        </ul>
    </section>
</template>
