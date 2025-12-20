<script setup>
import { onMounted, ref } from 'vue';
import * as S3Urls from '@/services/s3/urls';

const { src, classStr } = defineProps(['src', 'classStr'])
const localSrc = ref('default_profile.png')

async function handleImageError(event) {
    try {
        const updatedSrc = await S3Urls.refreshSignedUrl(event.target.currentSrc)
        localSrc.value = updatedSrc
    } catch (err) {
        console.error('Err [Image/handleImageError] ::', err.message)
        console.info(JSON.stringify(err))
        return
    }
}

onMounted(() => {
    if (src) {
        localSrc.value = src
    }
})

</script>

<template>
    <img :src="`${localSrc}`" 
        :class="classStr"
        @error="handleImageError" />
</template>