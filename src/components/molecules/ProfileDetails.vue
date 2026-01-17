<script setup>

const { name, screenName, bio, location, website, joinedDate, followingCount, followersCount } = defineProps(['name', 'screen-name', 'bio', 'location', 'website', 'joinedDate', 'followingCount', 'followersCount']);

</script>

<template>
    <section class="flex flex-col gap-2 md:gap-4">
        <section class="flex flex-col gap-1">
            <p class="font-bold text-xl">{{ name }}</p>
            <p class="text-dark">@{{ screenName }}</p>
        </section>
        <p v-if="bio">{{ bio }}</p>
        <section class="flex flex-col md:flex-row gap-4">
            <div v-if="location" class="flex flex-row gap-2">
                <i class="fas fa-map-marker-alt text-dark align-text-bottom"></i>
                <p class="text-dark">{{ location }}</p>
            </div>
            <div v-if="website" class="flex flex-row gap-2">
                <i class="fas fa-link text-dark align-text-bottom"></i>
                <a :href="`${website}`" target="_blank" class="text-dark">{{ website.replace('https://',
                    '').replace('http://', '') }}</a>
            </div>
            <div v-if="joinedDate" class="flex flex-row gap-2">
                <i class="far fa-calendar-alt text-dark align-text-bottom"></i>
                <p class="text-dark">Joined {{ joinedDate }}</p>
            </div>
        </section>
        <section class="flex flex-row gap-8">
            <a :href="`/${screenName}/following`" class="flex flex-row hover:underline">
                <span class="font-bold">{{ followingCount }}</span>
                <span class="text-dark whitespace-pre"> Following</span>
            </a>
            <a :href="`/${screenName}/followers`" class="flex flex-row hover:underline">
                <span class="font-bold">{{ followersCount }}</span>
                <span class="text-dark whitespace-pre"> Followers</span>
            </a>
        </section>
    </section>
</template>