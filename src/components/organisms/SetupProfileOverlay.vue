<script setup>
import { ref, onMounted, nextTick } from 'vue';
import fetch from 'axios';
import Overlay from '../templates/Overlay.vue';
import { getImgUploadUrl } from '@/services/graphql/controllers';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { useTwitterTimeline } from '@/stores/twitterTimeline';

const mainFocus = ref(null);
const nextFocus = ref(null);
const newImage = ref("default_profile.png");
const fileInput = ref(null);
const myProfile = useTwitterMyProfile();
const timeline = useTwitterTimeline();

const emit = defineEmits(['hide'])

function openFileInput() {
    fileInput.value.click()
}

function triggerHide() {
    emit('hide');
}

async function fileChange() {
    try {
        const file = fileInput.value.files[0];
        const extension = file.name.split('.').pop();
        const contentType = extension === 'png' ? 'image/png' : 'image/jpeg';
        const url = await getImgUploadUrl({ extension, contentType });
        const formData = new FormData();
        formData.append("image", file);
        const headers = { ['Content-Type']: contentType };

        const reqParams = {
            method: 'put',
            url,
            data: file,
            headers
        }
        const parsedUrl = url.split('?').shift()
        const [fileKey, ..._] = parsedUrl.split('/').reverse()
        await fetch(reqParams);
        const signedGetUrl = await myProfile.fetchSignedUrl(fileKey);
        newImage.value = signedGetUrl;

        await nextTick();

        // Focus the Next button
        if (nextFocus.value) {
            nextFocus.value.focus();
        } else {
            console.warn('Next button ref not found');
        }
    } catch (err) {
        console.error('Err [fileChange] :', err.message)
    }
}

async function finishSetup({ image, name }) {
    try {
        if (!image || !name) throw Error('Missing required parameters!')

        const newProfile = {
            name,
            imgUrl: image
        };

        await myProfile.changeProfile(newProfile)
        await timeline.getMyTimeline()
        triggerHide()
    } catch (err) {
        console.error('Err [finishSetup] :', err.message)
    }
}

onMounted(() => {
    mainFocus.value.focus()
})
</script>


<template>
    <Overlay @hide="triggerHide">
        <template #content>
            <header class="p-4 h-fit">
                <button v-if="newImage === null || newImage === 'default_profile.png'" @click="$emit('hide')"
                    class="rounded-full bg-white font-bold text-blue relative px-4 py-2 right-0 float-right focus:outline-none hover:bg-lightblue">
                    Skip for now
                </button>
                <button ref="nextFocus" v-if="newImage !== null && newImage !== 'default_profile.png'"
                    @click="finishSetup({ image: newImage, name: myProfile.screenName })"
                    class="rounded-full bg-blue font-bold text-white relative px-4 py-2 right-0 float-right focus:outline-none hover:bg-darkblue">
                    Next
                </button>
                <i class="relative py-2 fab fa-twitter text-blue text-2xl" style="margin-left: 50%"></i>
            </header>

            <section class="px-8 flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <p class="text-2xl font-bold">Pick a profile picture</p>
                </div>
                <p class="text-dark">Have a favorite selfie? Upload it now.</p>

                <div class="w-full flex items-center justify-center">
                    <section class="h-32 grid grid-cols-1 grid-rows-1">
                        <div class="col-1 row-1 w-full h-full rounded-full bg-gray-600 opacity-50 z-1"></div>
                        <img class="col-1 row-1 size-32 rounded-full z-2" :src="newImage" />
                        <button ref="mainFocus" @click="openFileInput" v-if="newImage === 'default_profile.png'"
                            class="col-1 row-1 hover:bg-gray-400 hover:cursor-pointer p-3 rounded-full z-3 opacity-75   ">
                            <i v-if="newImage === 'default_profile.png'" class="text-2xl fas fa-camera text-white"></i>
                            <input @change="fileChange" ref="fileInput" accept="image/jpeg" type="file" class="hidden">
                        </button>
                    </section>
                </div>
            </section>
        </template>
    </Overlay>
</template>