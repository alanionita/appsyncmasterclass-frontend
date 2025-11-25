import { defineStore } from 'pinia';
import * as S3Urls from '@/services/s3/urls';
import * as DateUtils from '@/utils/date';
import { useTwitterMyProfile } from './twitterMyProfile';
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

function followsMe(followingList) {
    try {
        const myProfile = useTwitterMyProfile();
        const theirUserFollowsMe = followingList.filter(({ id }) => {
            return id === myProfile.id
        })
        return theirUserFollowsMe.length == 1
    } catch (err) {
        console.error('Err [twitterMyProfile.followsMe()', err.message)

    }
}
function iFollowThem(followersList) {
    try {
        const myProfile = useTwitterMyProfile();
        const iFollowThem = followersList.filter(({ id }) => {
            return id === myProfile.id
        })

        return iFollowThem.length == 1
    } catch (err) {
        console.error('Err [twitterMyProfile.iFollowThem()', err.message)
    }
}

export const useTwitterTheirProfile = defineStore('twitterTheirProfile', {
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
        followed: false,
        followMe: false,
        tweetsCount: 0
    }),
    actions: {
        async setProfile(screenName) {
            try {
                const ui = useUi();
                const { appsyncClient } = useAppsync()
                const profile = await appsyncClient.getProfile({ screenName })
                ui.reset()
                if (profile) {
                    const keys = Object.keys(profile);
                    for (let key of keys) {
                        this[key] = profile[key]
                    }
                } else {
                    ui.toggleNoProfile();
                    return;
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
        },
        async getFollowing(limit = 10, nextToken = null) {
            try {
                const { appsyncClient } = useAppsync()
                if (nextToken) {
                    const data = await appsyncClient.getFollowing({ userId: this.id, limit, nextToken });
                    this.following = data.profiles;
                    this.followingNextToken = data.nextToken
                    this.followingCount = data.profiles.length;

                    this.followMe = followsMe(data.profiles)
                } else {
                    const data = await appsyncClient.getFollowing({ userId: this.id, limit });
                    this.following = data.profiles;
                    this.followingNextToken = null
                    this.followingCount = data.profiles.length;

                    this.followMe = followsMe(data.profiles)
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

                    this.followed = iFollowThem(data.profiles)
                    return;
                } else {
                    const data = await appsyncClient.getFollowers({ userId: this.id, limit });
                    this.followers = data.profiles;
                    this.followersNextToken = null
                    this.followersCount = data.profiles.length;

                    this.followed = iFollowThem(data.profiles);
                    return;
                }
            } catch (err) {
                console.error('Err [twitterMyProfile.getFollowers()', err.message)
                throw err
            }
        },
        async follow() {
            try {
                const { appsyncClient } = useAppsync();
                const res = await appsyncClient.follow({ userId: this.id })
                if (res) {
                    this.followersCount += 1;
                    this.followed = true
                }
            } catch (err) {
                console.error('Err [twitterMyProfile.follow()', err.message)
            }
        },
        async unfollow() {
            try {
                const { appsyncClient } = useAppsync();
                const res = await appsyncClient.unfollow({ userId: this.id })
                if (res) {
                    this.followersCount -= 1;
                    this.followed = false
                }
            } catch (err) {
                console.error('Err [twitterMyProfile.unfollow()', err.message)
            }
        }
    },
    getters: {
        joinedDate: state => DateUtils.formatProfileCreatedAt(state),
        bgImgUrlSigned: state => fetchS3SignedUrl(state, 'bgImgUrl'),
        imgUrlSigned: state => fetchS3SignedUrl(state, 'imgUrl')
    },
});