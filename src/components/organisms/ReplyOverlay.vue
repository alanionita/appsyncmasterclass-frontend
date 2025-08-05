<script setup>
import { postReply } from '@/services/graphql/controllers';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { useTwitterTimeline } from '@/stores/twitterTimeline';
import { onMounted, ref } from 'vue';

const { tweet } = defineProps(["tweet"]);
const emit = defineEmits(['hide'])

const replyInput = ref(null);

const profile = useTwitterMyProfile();
const timeline = useTwitterTimeline();

const replyText = defineModel('replyText');

async function sendReply() {
    try {
        if (!replyText.value.length === 0) throw Error('Cannot post an empty reply');
        await postReply({ tweetId: tweet.id, text: replyText.value })
        await timeline.getMyTimeline();
        emit('hide');
    } catch (err) {
        console.error('Err [ReplyOverlay/sendReply] :', err.message)
    }
}

function handleESCkey() {
    try {
        emit('hide');
    } catch (err) {
        console.error('Err [ReplyOverlay/handleESCkey] :', err.message)
    }
}

function focusOnInput() {
    if (replyInput.value) {
        replyInput.value.focus();
    }
};


onMounted(() => {
    focusOnInput()
})

</script>

<template>
    <div @keydown.esc="handleESCkey()"
        class="fixed w-full h-full z-10 top-0 left-0 flex items-center justify-center">
        <div @click.prevent="$emit('hide')" class="absolute w-full h-full bg-gray-900 opacity-50"></div>

        <div class="modal-main bg-white mx-auto rounded-lg z-0 overflow-y-auto" style="width:40%">
            <div class="pl-1 pr-4 py-1 h-16 border-b-2 border-lightblue">
                <div class="flex flex-row mt-1 ml-4">
                    <i @click.prevent="$emit('hide')"
                        class="fas fa-times text-blue text-2xl mb-8 mr-6 rounded-full bg-white p-2 px-3 hover:bg-lightblue"></i>
                </div>
            </div>

            <div class="border-l-2 border-r-2 border-white flex flex-col">
                <!-- original Tweet -->
                <div class="p-3 flex flex-row">
                    <div class="flex-none mr-4">
                        <img :src="`${tweet.profile.imageUrl || 'default_profile.png'}`"
                            class="h-12 w-12 rounded-full flex-none" />
                    </div>

                    <div class="w-full">
                        <div class="flex items-center w-full">
                            <p class="font-semibold">{{ tweet.profile.name }}</p>
                            <p class="text-sm text-dark ml-2">@{{ tweet.profile.screenName }}</p>
                            <p class="text-sm text-dark ml-2">.</p>
                            <p class="text-sm text-dark ml-2">{{ $filters.timeago(tweet.createdAt) }}</p>
                        </div>
                        <p class="py-2">
                            {{ tweet.text }}
                        </p>
                    </div>
                </div>

                <!-- TODO: should add all the replies to the original Tweet in date order -->

                <!-- Reply Form -->
                <div class="p-3 flex flex-row">
                    <div class="flex-none mr-4">
                        <img :src="`${profile.imgUrl || 'default_profile.png'}`"
                            class="h-12 w-12 rounded-full flex-none" />
                    </div>

                    <div class="w-full mb-2">
                        <form @submit.prevent="sendReply" class="w-full relative">
                            <textarea ref="replyInput" v-model="replyText" placeholder="Tweet your reply"
                                class="w-full focus:outline-none mt-3 pb-3"></textarea>
                            <div>
                                <i class="text-lg text-blue mr-4 far fa-image"></i>
                                <i class="text-lg text-blue mr-4 fas fa-film"></i>
                                <i class="text-lg text-blue mr-4 far fa-chart-bar"></i>
                                <i class="text-lg text-blue mr-4 far fa-smile"></i>
                            </div>
                            <button type="submit"
                                class="h-10 px-4 text-white font-semibold bg-blue hover:bg-darkblue rounded-full absolute bottom-0 right-0"
                                :class="`${replyText ? '' : ' opacity-50 cursor-not-allowed'}`">Reply</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
