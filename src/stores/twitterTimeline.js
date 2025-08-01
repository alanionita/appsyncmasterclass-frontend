import { defineStore } from 'pinia';
import * as gql from '@/services/graphql/controllers'

export const useTwitterTimeline = defineStore('twitterTimeline', {
    state: () => ({
        tweets: [],
        nextToken: null
    }),
    actions: {
        async createTweet(text) {
            const newTweet = await gql.postTweet(text);
            this.tweets = this.tweets.toSpliced(0, 0, newTweet);
        },
        async getMyTimeline(limit = 10, nextToken = null) {
            try {
                const timeline = await gql.getMyTimeline(limit, nextToken);

                this.tweets = timeline.tweets

                if (timeline.nextToken) {
                    this.nextToken = timeline.nextToken
                }
            } catch (err) {
                console.error('twitterTimeline.getMyTimeline :', err.message)
            }
        },
        async getTweets(userId, limit = 10, nextToken = null) {
            try {
                const timeline = await gql.getTweets({ userId, limit, nextToken });

                this.tweets = timeline.tweets

                if (timeline.nextToken) {
                    this.nextToken = timeline.nextToken
                }
            } catch (err) {
                console.error('twitterTimeline.getTweets :', err.message)
            }
        }
    },
    getters: {
    },
});