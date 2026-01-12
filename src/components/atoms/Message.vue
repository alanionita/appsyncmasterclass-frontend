<script setup>
import Image from './Image.vue';
import LinkifyText from './LinkifyText.vue';

const { message } = defineProps(['message'])

function isMyMessage(_message) {
    return _message.from.__typename === 'MyProfile'
}

</script>

<template>
    <section v-if="isMyMessage(message)" class="grid grid-cols-(--grid-cols-6-avatar) gap-y-2 auto-cols-min auto-rows-min">
        <LinkifyText 
            :text="message.message"
            :classStr="`col-start-4 col-span-3 row-start-1 p-4 bg-blue rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white`" />

        <aside class="col-start-5 col-span-3 row-start-2">
            <p class="text-xs text-dark text-right">
                {{ $filters.time(message.timestamp) }}
            </p>
        </aside>
    </section>
    <!-- Other -->
    <section v-if="!isMyMessage(message)"
        class="grid grid-cols-(--grid-cols-6-avatar) gap-y-2 auto-cols-min auto-rows-min">
        <a :href="`#/${message.from.screenName}`" class="col-start-1 col-span-1 row-start-1">
            <Image :src="message.from.imgUrl" :classStr="`h-12 w-12 rounded-full flex-none`" />
        </a>
        <LinkifyText 
            :text="message.message"
            :classStr="`col-start-2 col-span-3 row-start-1 p-4 bg-lighter rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-black`" />
        <aside class="col-start-2 col-span-3 row-start-2">
            <p class="text-xs text-dark justify-start">
                {{ $filters.time(message.timestamp) }}
            </p>
        </aside>
    </section>
</template>