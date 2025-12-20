<script setup>
import { onMounted, ref } from 'vue';
import { generateHtmlLinks } from '@/utils/urls';

const { text, classStr } = defineProps(['text', 'classStr'])
const textEl = ref(null);
const textElHtml = ref(null);

onMounted(() => {
    if (text && text.length > 0) {
        const tweetTextHtml = generateHtmlLinks(text)
        textElHtml.value = tweetTextHtml
    }
})

</script>

<template>
    <p :ref="textEl" :class="classStr" v-html="textElHtml">
    </p>
</template>