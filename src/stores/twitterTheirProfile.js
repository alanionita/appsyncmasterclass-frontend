import { defineStore } from 'pinia';
import * as gql from '@/services/graphql/controllers'
import { format } from 'date-fns';

const defaultImgUrl = 'default_profile.png';
const defaultCreatedAt = '1970-01-01';

function formatProfileCreatedAt({ createdAt }) {
    try {
        const date = new Date(createdAt);
        return format(date, 'MMMM yyyy')

    } catch (err) {
        console.error('Err [twitterTheirProfile/formatProfileCreatedAt] :', err.message)
    }
}

export const useTwitterTheirProfile = defineStore('twitterTheirProfile', {
    state: () => ({
        createdAt: defaultCreatedAt,
        id: '',
        imgUrl: defaultImgUrl,
        name: "",
        screenName: ""
    }),
    actions: {
        async setProfile(screenName) {
            try {
                const profile = await gql.getProfile({screenName})
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
        }
    },
    getters: {
        joinedDate: state => formatProfileCreatedAt(state),
        isSelf: state => screenName => state.screenName == screenName,
    },
});