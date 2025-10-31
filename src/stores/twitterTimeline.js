import { defineStore } from 'pinia';
import * as gql from '@/services/graphql/controllers'
import { useTwitterMyProfile } from './twitterMyProfile';
import { useTwitterTheirProfile } from './twitterTheirProfile';

async function paginateMyTweets(state) {
    try {
        const { tweetsCount } = useTwitterMyProfile();
        if (!state.nextToken) return
        const tweetsLeft = tweetsCount - state.fetchedCount
        const perPage = tweetsLeft >= state.limit ? state.limit : tweetsLeft
        if (perPage < state.limit) {
            state.hasMore = false
        }

        const data = await gql.getMyTimeline(perPage, state.nextToken);

        const timeline = JSON.parse(JSON.stringify(data))

        state.tweets = [...state.tweets, ...timeline.tweets]
        state.fetchedCount += timeline.tweets.length
        if (!timeline.nextToken) {
            state.nextToken = null
        } else {
            state.nextToken = timeline.nextToken
        }
    } catch (err) {
        console.error('Err [twitterTimeline.paginateMyTweets] ::', err.message)
        console.info(JSON.stringify(err))
    }
}

async function paginateTweets(state) {
    try {
        const { tweetsCount, id } = useTwitterTheirProfile();
        if (!state.nextToken) return
        const tweetsLeft = tweetsCount - state.fetchedCount
        const perPage = tweetsLeft >= state.limit ? state.limit : tweetsLeft
        if (perPage < state.limit) {
            state.hasMore = false
        }

        const data = await gql.getTweets({ 
            userId: id, 
            limit: perPage, 
            nextToken: state.nextToken 
        });

        const timeline = JSON.parse(JSON.stringify(data))
        state.tweets = [...state.tweets, ...timeline.tweets]
        state.fetchedCount += timeline.tweets.length
        if (!timeline.nextToken) {
            state.nextToken = null
        } else {
            state.nextToken = timeline.nextToken
        }
    } catch (err) {
        console.error('Err [twitterTimeline.paginateTweets] ::', err.message)
        console.info(JSON.stringify(err))
    }

}

export const useTwitterTimeline = defineStore('twitterTimeline', {
    state: () => ({
        tweets: [],
        nextToken: null,
        fetchedCount: 0,
        hasMore: true,
        limit: 10,
    }),
    actions: {
        async createTweet(text) {
            const newTweet = await gql.postTweet(text);
            this.tweets = this.tweets.toSpliced(0, 0, newTweet);
        },
        async getMyTimeline(nextToken = null) {
            try {
                const data = await gql.getMyTimeline(this.limit, nextToken);


                const timeline = JSON.parse(JSON.stringify(data))

                this.tweets = timeline.tweets
                this.fetchedCount += timeline.tweets.length
                if (!timeline.nextToken) {
                    this.nextToken = null
                } else {
                    this.nextToken = timeline.nextToken
                }
            } catch (err) {
                console.error('twitterTimeline.getMyTimeline :', err.message)
                return err
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
        },
        async loadMoreTweets(myProfile = true) {
            try {
                if (this.hasMore) {
                    if (myProfile) {
                        await paginateMyTweets(this)
                    } else {
                        await paginateTweets(this)
                    }
                }
            } catch (err) {
                console.error('Err [twitterTimeline.loadMoreTweets] ::', err.message)
                console.info(JSON.stringify(err))
            }
        }
    },
    getters: {
    },
});