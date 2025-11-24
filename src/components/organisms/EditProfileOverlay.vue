<script setup>
import { ref, defineModel, onMounted } from 'vue';
import { format, parse } from 'date-fns';
import { useTwitterMyProfile } from '@/stores/twitterMyProfile';
import { useTwitterTimeline } from '@/stores/twitterTimeline';
import { useAppsync } from '@/stores/appsync';
import Overlay from '../templates/Overlay.vue';
import { fetchAuthSession } from 'aws-amplify/auth';
import { uploadData } from "aws-amplify/storage";
import ImageSkeletonBackground from '../atoms/ImageSkeletonBackground.vue';
import ImageSkeletonProfile from '../atoms/ImageSkeletonProfile.vue';


// Refs
const mainFocus = ref(null);
const session = ref(null);
const imgFileInput = ref(null);
const bgFileInput = ref(null);
const imgLoading = ref(false);
const bgImgLoading = ref(false);

const fileInputs = {
    imgUrl: imgFileInput,
    bgImgUrl: bgFileInput
}

// Models
const name = defineModel('name', { default: undefined });
const bio = defineModel('bio', { default: undefined });
const location = defineModel('location', { default: undefined });
const website = defineModel('website', { default: undefined });
const birthdate = defineModel('birthdate', { default: undefined });
const bgImgUrl = ref(null);
const imgUrl = ref("default_profile.png");

// Stores
const myProfile = useTwitterMyProfile();
const timeline = useTwitterTimeline();
const { appsyncClient } = useAppsync();

// Emits
const emit = defineEmits(['hide'])

function triggerHide() {
    emit('hide');
}

// Logic
function openFileInput(ref) {
    const r = fileInputs[ref];
    r.value.click()
}

async function fileChange(label) {
    try {
        if (!label) throw Error('Missing file input label')
        const file = fileInputs[label].value.files[0];
        const extension = file.name.split('.').pop();
        const contentType = extension === 'png' ? 'image/png' : 'image/jpeg';
        const { fileKey } = await appsyncClient.getImgUploadUrl({ extension, contentType });
        
        const formData = new FormData();
        
        formData.append("image", file);

        const res = await uploadData({
            path: fileKey,
            data: file,
            options: {
                contentType,
                onProgress: ({ transferredBytes, totalBytes }) => {
                    if (totalBytes) {
                        if (label.startsWith('img')) {
                            imgLoading.value = true;
                        }
                        if (label.startsWith('bgImg')) {
                            bgImgLoading.value = true;
                        }
                        console.info(
                            `Upload progress [${label}] : ${Math.round(
                                (transferredBytes / totalBytes) * 100
                            )} %`
                        );
                    }
                },
            },
        }).result;

        if(fileKey !== res.path) throw Error('Upload response: invalid file key')

        const signedGetUrl = await myProfile.fetchSignedUrl(fileKey);
        
        if (label.startsWith('img')) {
            imgLoading.value = false;
            imgUrl.value = signedGetUrl;
        }
        if (label.startsWith('bgImg')) {
            bgImgLoading.value = false;
            bgImgUrl.value = signedGetUrl;
        }
    } catch (err) {
        console.error('Err [fileChange] :', err.message)
    }
}

async function saveProfile() {
    try {
        const p = {
            name: name.value,
            imgUrl: imgUrl.value,
            bgImgUrl: bgImgUrl.value,
            bio: bio.value,
            location: location.value,
            website: website.value,
            birthdate: ''
        };

        if (birthdate.value) {
            const parsedBirthdate = parse(birthdate.value, 'dd-MM-yyyy', new Date());
            const formattedBDate = format(parsedBirthdate, 'yyyy-MM-dd')
            p.birthdate = formattedBDate;
        }

        // Keep the updates only
        const updatesOnly = {}

        for (let key in p) {
            if (p[key] && p[key].length !== 0) {
                updatesOnly[key] = p[key]
            }
        }

        // Post updates
        if (updatesOnly.name) {
            await myProfile.changeProfile(updatesOnly);
            await timeline.getMyTimeline()
            triggerHide()
        } else {
            await timeline.getMyTimeline()
            triggerHide()
        }
    } catch (err) {
        console.error("Err [saveProfile] :", err.message)
        console.info(JSON.stringify(err))
    }

}

onMounted(async () => {
    mainFocus.value.focus();

    name.value = myProfile.name.length > 0 && myProfile.name || myProfile.screenName;
    bio.value = myProfile.bio || '';
    location.value = myProfile.location || ''
    website.value = myProfile.website || '';
    birthdate.value = myProfile.birthdate ? format(new Date(myProfile.birthdate), 'dd-MM-yyyy') : ''
    imgUrl.value = myProfile.imgUrl || 'default_profile.png'
    bgImgUrl.value = myProfile.bgImgUrl || null

    session.value = await fetchAuthSession()
})


</script>

<template>
    <Overlay @hide="triggerHide">
        <template #content>
            <header class="pb-4 pl-0 h-fit border-b-2 border-lightblue">
                <button @click="saveProfile()"
                    class="rounded-full bg-blue font-bold text-white relative px-4 py-2 right-0 float-right focus:outline-none hover:bg-darkblue">
                    Save
                </button>
                <div class="flex flex-row items-center gap-4">
                    <i @click="triggerHide()"
                        class="fas fa-times text-blue text-2xl rounded-full bg-white p-2 px-3 hover:bg-lightblue"></i>
                    <p class="text-xl font-bold">Edit profile</p>
                </div>
            </header>

            <div class="border-l-2 border-r-2 border-white">
                <!-- background image -->
                <div class="grid grid-cols-1 grid-rows-1 h-54">
                    <!-- change background overlay -->
                    <figure v-if="bgImgLoading" class="col-1 row-1 h-full max-h-full z-1">
                        <ImageSkeletonBackground />
                    </figure>
                    <div v-if="bgImgUrl" class="col-1 row-1 h-full max-h-full z-2">
                        <img v-if="!bgImgLoading" :src="bgImgUrl" class="h-full w-full object-cover" />
                    </div>
                    <div class="col-1 row-1 flex flex-col justify-center items-center bg-gray-500">
                        <button @click="openFileInput('bgImgUrl')" class="hover:bg-gray-800 p-3 rounded-full z-3 opacity-50">
                            <i class="text-2xl fas fa-camera text-white"></i>
                            <input @change="fileChange('bgImgUrl')" ref="bgFileInput" accept="image/jpeg" type="file"
                                class="hidden">
                        </button>
                    </div>
                </div>

                <div class="p-2 flex flex-col gap-4 mb-16">
                    <section class="-mt-18 size-32 grid grid-cols-1 grid-rows-1">
                        <div class="col-1 row-1 w-full h-full rounded-full bg-gray-600 opacity-50 z-1"></div>
                        <figure v-if="imgLoading" class="relative col-1 row-1 size-32 rounded-full z-2 grid grid-cols-1 grid-rows-1">
                            <ImageSkeletonProfile />
                        </figure>
                        <img v-if="!imgLoading" class="col-1 row-1 size-32 rounded-full z-2" :src="imgUrl" />
                        <button @click="openFileInput('imgUrl')"
                            class="col-1 row-1 hover:bg-gray-300 hover:cursor-pointer p-3 rounded-full z-3 opacity-50   ">
                            <i class="text-2xl fas fa-camera text-white"></i>
                            <input @change="fileChange('imgUrl')" ref="imgFileInput" accept="image/jpeg" type="file"
                                class="hidden">
                        </button>
                    </section>

                    <fieldset class="w-full bg-lightest border-b-2 border-lighter py-1 px-3">
                        <label class="text-lg" for="profileName">Name</label>
                        <input ref="mainFocus" v-model="name" name="profileName"
                            class="w-full bg-lightest text-lg focus:outline-none" type="text"
                            placeholder="Please enter your full name">
                    </fieldset>
                    <fieldset class="w-full bg-lightest border-b-2 border-lighter py-1 px-3">
                        <label class="text-lg" for="bio">Bio</label>
                        <textarea v-model="bio" name="bio" class="w-full bg-lightest text-lg focus:outline-none"
                            type="text" placeholder="Add your bio" />
                    </fieldset>
                    <fieldset class="w-full bg-lightest border-b-2 border-lighter py-1 px-3">
                        <label class="text-lg" for="location">Location</label>
                        <input v-model="location" name="location" class="w-full bg-lightest text-lg focus:outline-none"
                            type="text" placeholder="Add your location">
                    </fieldset>
                    <fieldset class="w-full bg-lightest border-b-2 border-lighter py-1 px-3">
                        <label class="text-lg" for="website">Website</label>
                        <input v-model="website" name="website" class="w-full bg-lightest text-lg focus:outline-none"
                            type="text" placeholder="Add your website">
                    </fieldset>
                    <fieldset class="w-full bg-lightest border-b-2 border-lighter py-1 px-3">
                        <label class="text-lg" for="birthdate">Birth date</label>
                        <input v-model="birthdate" name="birthdate"
                            class="w-full bg-lightest text-lg focus:outline-none" type="text"
                            placeholder="Add your birth date (Eg: 2025-08-31)">
                    </fieldset>
                    <button @click.prevent="saveProfile()"
                        class="rounded-full bg-blue font-bold text-white relative px-4 py-2 align-end w-24 focus:outline-none hover:bg-darkblue">
                        Save
                    </button>
                </div>
            </div>
        </template>
    </Overlay>
</template>