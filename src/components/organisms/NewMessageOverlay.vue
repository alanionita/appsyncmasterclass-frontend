<script setup>

import Loader from '../atoms/Loader.vue'
import { reactive, ref } from 'vue';
import { useUi } from '@/stores/ui';
import { storeToRefs } from 'pinia';

const query = ref('')
const noResults = ref('')
const mode = ref('People')

// store placeholders
const storeUi = useUi();
const { closeNewMessageModal } = storeUi;
const { loadingNewMessageModal } = storeToRefs(storeUi)
const results = ref([]) // twitter.search
const profile = reactive({}) // profile

async function openConversation(user) {
    console.log(user);
    $emit('update:showNewMessageModal', false);
}

async function submit() {
    noResults = query;
    resetSearch();
    await loadSearch({
        query: query,
        mode: mode,
        limit: 10,
    }).then(() => {
        loading = false;
    });
}
function selected(user) {
    $emit('selected', user);
}

// TODO: old component methods, for reference, needs to be refactor to new apis
// import { mapActions, mapGetters } from 'vuex';
// export default {
//     name: "NewMessageOverlay",
//     methods: {
//         ...mapActions('twitter', [
//             'loadProfile',
//             'loadSearch',
//             'loadMoreSearch',
//             'resetSearch'
//         ]),
//     },
//     created() {
//         window.addEventListener('keyup', () => {
//             if (event.keyCode === 27) this.$emit('update:showNewMessageModal', false);
//         })
//         this.submit();
//     },
//     destroyed: function () {
//         window.removeEventListener('keyup', () => {
//             if (event.keyCode === 27) this.$emit('update:showNewMessageModal', false);
//         })
//     }

</script>

<template>
    <div class="fixed w-full h-full top-0 left-0 flex items-center justify-center">
        <div class="absolute w-full h-full bg-gray-900 opacity-50" @click.prevent="closeNewMessageModal()"></div>

        <article class="modal-main bg-white mx-auto rounded-lg z-50 overflow-y-auto w-full sm:w-3/5 md:w-2/5 max-h-full">
            <header class="p-4 h-16 flex gap-2 align-center border-b-2 border-lightblue">
                <span class="size-8 bg-white hover:bg-lightblue rounded-full flex justify-center items-center">
                    <i @click="closeNewMessageModal()"
                        class="h-fit fas fa-times text-blue text-2xl text-center"></i>
                </span>
                <p class="text-xl font-bold">New message</p>
            </header>

            <div class="p-4 flex flex-col border-b-2 border-lightblue">
                <div class="lg:block w-full">
                    <i class="fas fa-search absolute mt-4 ml-4 text-xl text-light"></i>
                    <input
                        class="pl-12 rounded-full w-full p-4 bg-lighter text-m focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue"
                        placeholder="Search People" type="search" v-model="query" v-on:keyup.enter="submit()" />
                </div>
            </div>

            <Loader v-if="loadingNewMessageModal" />
            <section v-if="!loadingNewMessageModal && results && results.length === 0"
                class="flex flex-col items-start justify-center w-full pt-8 p-16">
                <p class="font-bold text-lg">No results for "{{ query }}"</p>
                <p class="text-sm text-dark">The query you entered did not bring up any results.</p>
                
            </section>

            <!-- <ResultsNewMessage :results="results" @selected="selected" /> -->
        </article>
    </div>
</template>