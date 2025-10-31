import { defineStore } from 'pinia';
import * as gql from '@/services/graphql/controllers'
import { useTwitterMyProfile } from './twitterMyProfile';

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
                        const { tweetsCount } = useTwitterMyProfile();
                        if (!this.nextToken) return
                        const tweetsLeft = tweetsCount - this.fetchedCount
                        const perPage = tweetsLeft >= this.limit ? this.limit : tweetsLeft
                        if (perPage < this.limit) {
                            this.hasMore = false
                        }

                        const data = await gql.getMyTimeline(perPage, this.nextToken);
        
                        const timeline = JSON.parse(JSON.stringify(data))
    
                        this.tweets = [...this.tweets, ...timeline.tweets]
                        this.fetchedCount += timeline.tweets.length
                        if (!timeline.nextToken) {
                            this.nextToken = null
                        } else {
                            this.nextToken = timeline.nextToken
                        }
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