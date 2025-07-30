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
        console.error('Err [twitterProfile/formatProfileCreatedAt] :', err.message)
    }
}   

export const useTwitterProfile = defineStore('twitterProfile', {
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
                console.error('Err [twitter.setProfile()', err.message)
                throw err
            }
        }
    },
    getters: {
        joinedDate: state => formatProfileCreatedAt(state),
        isSelf: state => screenName => state.screenName == screenName,
    },
});