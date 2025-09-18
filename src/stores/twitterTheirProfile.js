import { defineStore } from 'pinia';
import * as gql from '@/services/graphql/controllers'
import { fetchAuthSession } from 'aws-amplify/auth';
import * as S3Utils from '@/utils/s3';
import * as DateUtils from '@/utils/date';

const defaultImgUrl = 'default_profile.png';
const defaultCreatedAt = '1970-01-01';

async function fetchS3SignedUrl(state, stateKey) {
    try {
        if (!stateKey) throw new Error('Missing state key');

        const { userSub } = await fetchAuthSession();

        if (!userSub) throw new Error('Not authenticated');

        const validKeys = ['imgUrl', 'bgImgUrl'];

        if (!validKeys.includes(stateKey)) throw new Error('Invalid state key');

        const { filePath } = await S3Utils.parseUrl(state[stateKey])
        state[stateKey] = await S3Utils.getSignedUrl(filePath)
    } catch (err) {
        console.error('Err [twitterMyProfile/fetchSignedUrl] ::', err.message)
        console.info(JSON.stringify(err))
        return state[stateKey]
    }
}

export const useTwitterTheirProfile = defineStore('twitterTheirProfile', {
    state: () => ({
        createdAt: defaultCreatedAt,
        id: '',
        imgUrl: defaultImgUrl,
        bgImgUrl: '',
        name: "",
        screenName: ""
    }),
    actions: {
        async setProfile(screenName) {
            try {
                const profile = await gql.getProfile({ screenName })
                if (profile) {
                    const keys = Object.keys(profile);
                    for (let key of keys) {
                        this[key] = profile[key]
                    }
                }
            } catch (err) {
                console.error('Err [twitterTheirProfile.setProfile()', err.message)
                throw err
            }
        },
        async refreshBgImgUrl() {
            await fetchS3SignedUrl(this, 'bgImgUrl')
        },
        async refreshImgUrl() {
            await fetchS3SignedUrl(this, 'imgUrl')
        }
    },
    getters: {
        joinedDate: state => DateUtils.formatProfileCreatedAt(state),
        isSelf: state => screenName => state.screenName == screenName,
        bgImgUrlSigned: state => fetchS3SignedUrl(state, 'bgImgUrl'),
        imgUrlSigned: state => fetchS3SignedUrl(state, 'imgUrl')
    },
});