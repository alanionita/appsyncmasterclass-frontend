import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { throwWithLabel } from "@/utils/error";
import * as Queries from "@/services/appsync/queries";
import * as Mutations from "@/services/appsync/mutations";

export class ApolloAppSync {
    client;
    constructor({ region, appSyncUrl, accessToken }) {
        const auth = {
            type: "AMAZON_COGNITO_USER_POOLS",
            jwtToken: accessToken
        };

        const httpLink = new HttpLink({
            uri: appSyncUrl
        });

        const config = {
            url: appSyncUrl,
            region,
            auth
        }

        const link = ApolloLink.from([
            createAuthLink(config),
            createSubscriptionHandshakeLink(config, httpLink),
        ]);

        this.client = new ApolloClient({
            link,
            cache: new InMemoryCache(), // Required
        });
    }

    /**
     * Triggers Query.getMyProfile with payload
     * @returns {Promise<MyProfile>} my profile object
     * @throws {Error} Either with custom payloads or GraphQL errors
     */
    async getMyProfile() {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")
            const GET_MYPROFILE = gql`${Queries.getMyProfile}`
            const { data, errors } = await this.client.query({
                query: GET_MYPROFILE,
                variables: {},
                errorPolicy: 'all'
            })
            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }
            if (data) {
                const profile = data.getMyProfile

                const profileEnriched = Object.assign({}, profile, { imgUrl: profile.imgUrl || 'default_profile.png' })

                return profileEnriched
            };
        } catch (err) {
            throwWithLabel(err, `services/apollo.getMyProfile`)
        }
    }

    /**
     * Triggers Query.getMyProfile with payload
     * @param {Object} limit - max amout fetched per page
     * @param {String} nextToken - token used for navigating to next page
     * @returns {Promise<UnhydratedTweetsPage>} { tweets: [], nextToken: string | null }
     * @throws {Error} Either with custom payloads or GraphQL errors
     */
    async getMyTimeline(limit = 10, nextToken = null) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            const GET_MYTIMELINE = gql`${Queries.getMyTimeline}`

            const queryParams = {
                query: GET_MYTIMELINE,
                variables: {
                    limit
                },
                errorPolicy: 'all'
            }

            if (nextToken) {
                queryParams.variables["nextToken"] = nextToken
            }

            const { data, errors } = await this.client.query(queryParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            if (data) {
                const timeline = data.getMyTimeline

                return timeline
            };
        } catch (err) {
            throwWithLabel(err, `services/apollo.getMyTimeline`)
        }
    }

    /**
     * Triggers Mutation.tweet with payload
     * @param {String} text - text of new tweet to be created
     * @returns {Promise<Tweet>} 
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async postTweet(text) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!text) throw Error('Missing required param text')

            const TWEET = gql`${Mutations.tweet}`

            const mutationParams = {
                mutation: TWEET,
                variables: {
                    text
                },
                errorPolicy: 'all'
            }

            const { data, errors } = await this.client.mutate(mutationParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            if (data) {
                return data.tweet
            };

        } catch (err) {
            throwWithLabel(err, `services/apollo.postTweet`)
        }
    }

    /**
     * Triggers Mutation.like with payload
     * @param {String} tweetId - tweet.id of tweet to be liked
     * @returns {Promise<Boolean>} 
     * @throws {Error} Either with custom payloads or GraphQL errors
     */
    async likeTweet(tweetId) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!tweetId) throw Error('Missing required param tweetId')

            const LIKE = gql`${Mutations.like}`

            const mutationParams = {
                mutation: LIKE,
                variables: {
                    tweetId
                }
            }

            const { data, errors } = await this.client.mutate(mutationParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            return data && data

        } catch (err) {
            throwWithLabel(err, `services/apollo.likeTweet`)
        }
    }

    /**
     * Triggers Mutation.unlike with payload
     * @param {String} tweetId - tweet.id of tweet to be liked
     * @returns {Promise<Boolean>} 
     * @throws {Error} Either with custom payloads or GraphQL errors
     */
    async unlikeTweet(tweetId) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!tweetId) throw Error('Missing required param tweetId')

            const UNLIKE = gql`${Mutations.unlike}`

            const mutationParams = {
                mutation: UNLIKE,
                variables: {
                    tweetId
                }
            }

            const { data, errors } = await this.client.mutate(mutationParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            return data && data

        } catch (err) {
            throwWithLabel(err, `services/apollo.unlikeTweet`)
        }
    }

    /**
     * Triggers Mutation.retweet with payload
     * @param {String} tweetId - tweet.id of tweet to be retweeted
     * @returns {Promise<Retweet>} 
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async retweetTweet(tweetId) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!tweetId) throw Error('Missing required param tweetId')

            const RETWEET = gql`${Mutations.retweet}`

            const mutationParams = {
                mutation: RETWEET,
                variables: {
                    tweetId
                }
            }

            const { data, errors } = await this.client.mutate(mutationParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            return data && data.retweet
        } catch (err) {
            throwWithLabel(err, `services/apollo.retweetTweet`)
        }
    }

    /**
     * Triggers Mutation.unretweet with payload
     * @param {String} tweetId - tweet.id of tweet to be unretweeted
     * @returns {Promise<Boolean>} 
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async unretweetTweet(tweetId) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!tweetId) throw Error('Missing required param tweetId')

            const UNRETWEET = gql`${Mutations.unretweet}`

            const mutationParams = {
                mutation: UNRETWEET,
                variables: {
                    tweetId
                }
            }

            const { data, errors } = await this.client.mutate(mutationParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            return data && data.unretweet
        } catch (err) {
            throwWithLabel(err, `services/apollo.unretweetTweet`)
        }
    }

    /**
     * Triggers Mutation.reply with payload
     * @param {String} tweetId - tweet.id of tweet being replied to
     * @param {String} text - reply text
     * @returns {Promise<Reply>} 
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async postReply({ tweetId, text }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!tweetId) throw Error('Missing required param tweetId')
            if (!text) throw Error('Missing required param text')

            const REPLY = gql`${Mutations.reply}`

            const mutationParams = {
                mutation: REPLY,
                variables: {
                    tweetId,
                    text
                }
            }

            const { data, errors } = await this.client.mutate(mutationParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            return data && data.reply

        } catch (err) {
            console.info('Error [gql/controllers/postReply] :', err.message)
        }
    }
}
