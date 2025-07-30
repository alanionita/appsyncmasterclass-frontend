<script setup>
const followSuggestions = defineModel("followSuggestions", {
    default: [
        { imageUrl: 'https://i.imgur.com/jv6Hufs.jpg', name: 'Senzo', screenName: '@senzo_HQ', id: 'senzo_HQ' },
        { imageUrl: 'https://i.imgur.com/VXcv5Sj.jpg', name: 'Ant Stanley', screenName: '@IamStan', id: 'IamStan' },
        { imageUrl: 'https://i.imgur.com/wHoKLev.jpg', name: 'Hanna', screenName: '@bestofallhans', id: 'bestofallhans' }
    ]
})
</script>

<template>
    <article class="w-full rounded-lg bg-lightest my-4">
        <header class="p-4">
            <p class="text-lg font-semibold">Who to follow</p>
        </header>
        <ul>
            <li v-for="suggestion in followSuggestions" :key="suggestion.id">
                <section class="w-full flex hover:bg-lighter p-4 gap-4 border-t border-lighter">
                    <img :src="suggestion.imageUrl" class="size-12 rounded-full" />
                    <div class="hidden md:flex md:flex-col justify-center items-start">
                        <p class="text-left text-m font-semibold leading-tight">{{ suggestion.name }}</p>
                        <p class="text-left text-sm leading-tight text-dark">{{ suggestion.screenName }}</p>
                    </div>
                    <button
                        class="ml-auto text-sm text-blue font-semibold px-4 rounded-full border border-blue">
                        Follow
                    </button>
                </section>
            </li>
            <li>
                <button class="p-4 w-full hover:bg-lighter hover:cursor-pointer text-left text-blue border-t border-lighter">
                    Show More
                </button>
            </li>
        </ul>


    </article>
</template>