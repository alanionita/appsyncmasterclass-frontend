<script setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const screenName = route.params.screenName

</script>

<template>
    <div id="app" class="flex container h-screen w-full">
        <div class="flex-col">
            <h1 class="text-xl">Followers</h1>
            <p>ScreenName : {{ screenName }}</p>
        </div>
    </div>
</template>