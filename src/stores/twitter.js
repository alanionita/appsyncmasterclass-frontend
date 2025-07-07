import { defineStore } from 'pinia';
import * as gql from '@/services/graphql/controllers'

const defaultImgUrl = 'default_profile.png';
const defaultCreatedAt = '1970-01-01';

export const useTwitterStore = defineStore('twitter', {
    state: () => ({
        profile: {
            createAt: defaultCreatedAt,
            id: '',
            imgUrl: defaultImgUrl,
            name: "",
            screenName: "",
        }
    }),
    actions: {
        async setProfile() {
            try {
                const profile = await gql.getMyProfile()
                if (profile) {
                    this.profile = Object.assign({}, this.profile, profile)
                }
            } catch (err) {
                console.error('Err [twitter.setProfile()', err.message)
                throw err
            }
        }
    },
    getters: {
        profileImg({ profile }) {
            return profile && profile.imgUrl ? profile.imgUrl : defaultImgUrl
        },
    },
});