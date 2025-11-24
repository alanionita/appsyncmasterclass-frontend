import { defineStore } from 'pinia';
import * as gql from '@/services/graphql/controllers'
import { useTwitterMyProfile } from './twitterMyProfile';
import { useTwitterTheirProfile } from './twitterTheirProfile';
import { useAppsync } from './appsync';
import { throwWithLabel } from '@/utils/error';

async function paginateMyTweets(state) {
    try {
        const { tweetsCount } = useTwitterMyProfile();
        const { appsyncClient } = useAppsync();
        if (!state.nextToken) return
        const tweetsLeft = tweetsCount - state.fetchedCount
        const perPage = tweetsLeft >= state.limit ? state.limit : tweetsLeft
        if (perPage < state.limit) {
            state.hasMore = false
        }

        const data = await appsyncClient.getMyTimeline(perPage, state.nextToken);

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
        const { appsyncClient } = useAppsync();
        if (!state.nextToken) return
        const tweetsLeft = tweetsCount - state.fetchedCount
        const perPage = tweetsLeft >= state.limit ? state.limit : tweetsLeft
        if (perPage < state.limit) {
            state.hasMore = false
        }

        const data = await appsyncClient.getTweets({
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
            const { appsyncClient } = useAppsync();

            const newTweet = await appsyncClient.postTweet(text);
            this.tweets = this.tweets.toSpliced(0, 0, newTweet);
        },
        async getMyTimeline(nextToken = null) {
            try {
                const { tweetsCount } = useTwitterMyProfile();
                const { appsyncClient } = useAppsync();
                let data;

                const tweetsLeft = tweetsCount - this.fetchedCount
                const perPage = tweetsLeft >= this.limit ? this.limit : tweetsLeft
                if (perPage < this.limit) {
                    this.hasMore = false
                }

                if (nextToken) {
                    data = await appsyncClient.getMyTimeline(perPage, nextToken);
                }

                data = await appsyncClient.getMyTimeline(perPage);
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
                const { appsyncClient } = useAppsync();
                const timeline = await appsyncClient.getTweets({ userId, limit, nextToken });

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
        },
        pushToTimeline(tweet) {
            try {
                const foundTweet = this.tweets.filter(t => t.id === tweet.id)[0]
                if (!foundTweet) {
                    this.tweets = [tweet, ...this.tweets];
                    return;
                }
                return;
            } catch (err) {
                throwWithLabel('store/twitterTimeline.pushToTimeline')
            }
        }
    },
    getters: {
    },
});