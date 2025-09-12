<script setup>

const { name, tweetsCount, bgImgUrl, profile } = defineProps(['name', 'tweetsCount', 'bgImgUrl', 'profile']);

async function handleImageError() {
    await profile.bgImgUrlSigned;
}

</script>

<template>
    <header>
        <section class="flex gap-4 py-4 border-b border-lighter items-center">
            <button class="rounded-full p-3 px-4 focus:outline-none hover:bg-lightblue">
                <i class="fas fa-arrow-left text-blue"></i>
            </button>
            <div class="lg:block">
                <h1 class="text-xl font-bold">{{ name }}</h1>
                <p class="text-left text-sm leading-tight text-dark">{{ tweetsCount }} Tweets</p>
            </div>
        </section>

        <!-- background image -->
        <section class="border-b-1 border-lighter fl  ex" style="height:240px; display:block">
            <figure v-if="bgImgUrl" class="h-full max-h-full">
                <img :src="bgImgUrl" @error="handleImageError" class="h-full w-full object-cover" />
            </figure>
            <figure v-if="!bgImgUrl" class="bg-gray-400 h-full max-h-full">
            </figure>
        </section>
    </header>
</template>