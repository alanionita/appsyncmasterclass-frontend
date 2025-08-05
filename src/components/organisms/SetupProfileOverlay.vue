<script setup>
import { ref } from 'vue';
import fetch from 'axios';
import Overlay from '../templates/Overlay.vue';
import { getImgUploadUrl } from '@/services/graphql/controllers';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { useTwitterTimeline } from '@/stores/twitterTimeline';

const mainFocus = ref(null);
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
        await fetch(reqParams);
        newImage.value = url.split('?').shift();

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

</script>

<template>
    <Overlay :mainFocus="mainFocus" @hide="triggerHide">
        <template #content>
            <div class="pl-1 pr-4 py-1 h-12">
                <button v-if="newImage === null || newImage === 'default_profile.png'" @click="$emit('hide')"
                    class="rounded-full bg-white font-bold text-blue mt-2 p-1 px-3 relative right-0 float-right focus:outline-none hover:bg-lightblue">
                    Skip for now
                </button>
                <button v-if="newImage !== null && newImage !== 'default_profile.png'"
                    @click="finishSetup({ image: newImage, name: myProfile.screenName })"
                    class="rounded-full bg-blue font-bold text-white mt-2 p-1 px-4 relative right-0 float-right focus:outline-none hover:bg-darkblue">
                    Next
                </button>
                <i class="relative fab fa-twitter text-blue text-2xl mt-2 mb-8" style="margin-left: 50%"></i>
            </div>

            <div class="pt-5 px-8">
                <div class="flex justify-between items-center mb-5">
                    <p class="text-2xl font-bold">Pick a profile picture</p>
                </div>
                <p class="text-dark">Have a favorite selfie? Upload it now.</p>

                <div class="mt-16 w-full flex items-center justify-center">
                    <div class="fixed">
                        <div class="absolute w-32 h-32 rounded-full bg-gray-600 opacity-50"></div>
                        <button ref="mainFocus" @click="openFileInput"
                            class="fixed hover:bg-gray-800 p-3 rounded-full ml-10 mt-10">
                            <i class="text-2xl fas fa-camera text-white"></i>
                            <input @change="fileChange" ref="fileInput" accept="image/jpeg" type="file" class="hidden">
                        </button>
                        <img class="w-32 h-32 rounded-full" :src="newImage" />
                    </div>
                </div>
            </div>
        </template>
    </Overlay>
</template>