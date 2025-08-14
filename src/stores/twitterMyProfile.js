import { defineStore } from 'pinia';
import * as gql from '@/services/graphql/controllers'
import { format } from 'date-fns';
import { getUrl } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';

const defaultImgUrl = 'default_profile.png';
const defaultCreatedAt = '1970-01-01';

function formatProfileCreatedAt({ createdAt }) {
    try {
        const date = new Date(createdAt);
        return format(date, 'MMMM yyyy')

    } catch (err) {
        console.error('Err [twitterMyProfile/formatProfileCreatedAt] :', err.message)
    }
}

export const useTwitterMyProfile = defineStore('twitterMyProfile', {
    state: () => ({
        createdAt: defaultCreatedAt,
        id: '',
        imgUrl: defaultImgUrl,
        name: "",
        screenName: ""
    }),
    actions: {
        async setProfile() {
            try {
                const profile = await gql.getMyProfile()
                if (profile) {
                    const keys = Object.keys(profile);
                    for (let key of keys) {
                        this[key] = profile[key]
                    }
                }
            } catch (err) {
                console.error('Err [twitterMyProfile.setProfile()', err.message)
                throw err
            }
        },
        async changeProfile(newProfile) {
            try {
                if (!newProfile || !newProfile.name) throw Error("Missing required param")

                const profile = await gql.updateMyProfile(newProfile);
                if (profile) {
                    const keys = Object.keys(profile);
                    for (let key of keys) {
                        this[key] = profile[key]
                    }
                }
            } catch (err) {
                console.error('Err [twitterMyProfile.changeProfile()', err.message)
                throw err
            }
        },
        async fetchSignedUrl(assetPath, stateKey = 'imgUrl') {
            try {
                const { userSub } = await fetchAuthSession();
                if (!userSub) throw new Error('Not authenticated');

                const validKeys = ['imgUrl'];

                if (!validKeys.includes(stateKey)) throw new Error('Invalid state key');

                const { url } = await getUrl({
                    path: `${userSub}/${assetPath}`,
                    options: {
                        expiresIn: 300,
                        accessLevel: 'private'
                    }
                });
                this.imgUrl = url.toString();
            } catch (err) {
                console.error('Err [twitterMyProfile/fetchSignedUrl] ::', err.message)
                console.info(JSON.stringify(err))
            }
        }
    },
    getters: {
        joinedDate: state => formatProfileCreatedAt(state),
        isSelf: state => screenName => state.screenName == screenName,
    },
});