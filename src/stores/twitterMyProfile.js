import { defineStore } from 'pinia';
import * as S3Urls from '@/services/s3/urls';
import * as DateUtils from '@/utils/date';
import { useUi } from './ui';
import { useAppsync } from './appsync';

const defaultImgUrl = 'default_profile.png';
const defaultCreatedAt = '1970-01-01';

async function fetchS3SignedUrl(state, stateKey) {
    try {
        if (!stateKey) throw new Error('Missing state key');

        const validKeys = ['imgUrl', 'bgImgUrl'];

        if (!validKeys.includes(stateKey)) throw new Error('Invalid state key');

        if (state && state[stateKey]) {
            state[stateKey] = await S3Urls.refreshSignedUrl(state[stateKey])
        }
    } catch (err) {
        console.error('Err [twitterMyProfile/fetchSignedUrl] ::', err.message)
        console.info(JSON.stringify(err))
        return state[stateKey]
    }
}

export const useTwitterMyProfile = defineStore('twitterMyProfile', {
    state: () => ({
        createdAt: defaultCreatedAt,
        id: '',
        imgUrl: defaultImgUrl,
        bgImgUrl: '',
        name: "",
        screenName: "",
        following: [],
        followers: [],
        followingNextToken: null,
        followersNextToken: null,
        followersCount: 0,
        followingCount: 0,
        tweetsCount: 0
    }),
    actions: {
        async setProfile() {
            try {
                const ui = useUi();
                const { appsyncClient } = useAppsync();
                if (appsyncClient) {
                    const profile = await appsyncClient.getMyProfile();
                    ui.reset()
                    if (profile) {
                        const keys = Object.keys(profile);
                        for (let key of keys) {
                            this[key] = profile[key]
                        }
                    }
                }
            } catch (err) {
                console.error('Err [twitterMyProfile.setProfile()', err.message)
                throw err
            }
        },
        async changeProfile(newProfile) {
            try {
                const { appsyncClient } = useAppsync();
                if (!newProfile || !newProfile.name) throw Error("Missing required param")

                const profile = await appsyncClient.updateMyProfile(newProfile);
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
        async refreshBgImgUrl() {
            await fetchS3SignedUrl(this, 'bgImgUrl')
        },
        async refreshImgUrl() {
            await fetchS3SignedUrl(this, 'imgUrl')
        },
        async getFollowing(limit = 10, nextToken = null) {
            try {
                const { appsyncClient } = useAppsync()
                if (nextToken) {
                    const data = await appsyncClient.getFollowing({ userId: this.id, limit, nextToken });
                    this.following = data.profiles;
                    this.followingNextToken = data.nextToken
                    this.followingCount = data.profiles.length;
                } else {
                    const data = await appsyncClient.getFollowing({ userId: this.id, limit });
                    this.following = data.profiles;
                    this.followingNextToken = null
                    this.followingCount = data.profiles.length;
                }
            } catch (err) {
                console.error('Err [twitterMyProfile.getFollowing()', err.message)
                throw err
            }
        },
        async getFollowers(limit = 10, nextToken = null) {
            try {
                const { appsyncClient } = useAppsync()
                if (nextToken) {
                    const data = await appsyncClient.getFollowers({ userId: this.id, limit, nextToken });
                    this.followers = data.profiles;
                    this.followersNextToken = data.nextToken
                    this.followersCount = data.profiles.length;
                    return;
                } else {
                    const data = await appsyncClient.getFollowers({ userId: this.id, limit });
                    this.followers = data.profiles;
                    this.followersNextToken = null
                    this.followersCount = data.profiles.length;
                    return;
                }
            } catch (err) {
                console.error('Err [twitterMyProfile.getFollowers()', err.message)
                throw err
            }
        }
    },
    getters: {
        joinedDate: state => DateUtils.formatProfileCreatedAt(state),
        bgImgUrlSigned: state => fetchS3SignedUrl(state, 'bgImgUrl'),
        imgUrlSigned: state => fetchS3SignedUrl(state, 'imgUrl')
    },
});