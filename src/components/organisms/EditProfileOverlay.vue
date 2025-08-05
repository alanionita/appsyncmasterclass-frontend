<script setup>
import { ref } from 'vue';
import Overlay from '../templates/Overlay.vue';

const mainFocus = ref(null);

console.log('edit profile')

</script>

<template>
    <Overlay :mainFocus="mainFocus">
        <template #content>
            <h1>edit Profile</h1>
            <div class="flex flex-col">
                <label for="somet">Change somet</label>
                <input ref="mainFocus" class="bg-blue" name="somet" type="text">
            </div>
        </template>
    </Overlay>
</template>