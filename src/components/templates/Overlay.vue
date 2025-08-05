<script setup>
import { onUpdated, ref } from 'vue';

const { mainFocus, menu } = defineProps(["mainFocus", "menu"])
const emit = defineEmits(['hide'])
const modal = ref(null)

function hide() {
    emit('hide');
}

onUpdated(() => {
    if (mainFocus) {
        mainFocus.focus()
    }
})

</script>

<template>
    <div ref="modal" @keydown.esc="hide()"
        class="fixed w-full h-full z-3 top-0 left-0 flex items-center justify-center">
        <span @click="hide()" tabindex="-1" class="absolute w-full h-full bg-gray-900 opacity-50"></span>

        <div class="modal-main bg-white mx-auto rounded-lg z-0 overflow-y-auto" style="width:40%">
            <div v-if="menu" class="border-b-2 border-lightblue">
                <div class="flex flex-row align-middle p-3 size-16">
                    <i @click.prevent="$emit('hide')"
                        class="fas fa-times text-blue text-2xl rounded-full bg-white p-2 3 hover:bg-lightblue"></i>
                </div>
            </div>

            <div class="border-l-2 border-r-2 border-white flex flex-col p-4">
                <slot name="content"></slot>
            </div>
        </div>
    </div>
</template>
