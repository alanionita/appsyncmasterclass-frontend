import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { ApolloClient, ApolloLink, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { throwWithLabel } from "@/utils/error";
import { otherProfileFrag, tweetFrag, iProfileFrag, iTweetFrag, replyFrag, retweetFrag, myProfileFrag } from './utils'
import * as Queries from "@/services/apollo/appsync/queries";
import * as Mutations from "@/services/apollo/appsync/mutations";
import * as Subscriptions from "@/services/apollo/appsync/subscriptions";

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
     * @param {Number} limit - max amout fetched per page
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
            throwWithLabel(err, `services/apollo.postReply`)
        }
    }

    /**
     * Triggers Query.getProfile with payload
     * @param {String} screenName - user screenName to fetch
     * @returns {Promise<OtherProfile>} 
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async getProfile({ screenName }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!screenName) throw Error('Missing required param screenName')

            const GET_PROFILE = gql`${Queries.getProfile}`

            const queryParams = {
                query: GET_PROFILE,
                variables: {
                    screenName,
                }
            }

            const { data, errors } = await this.client.query(queryParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            if (data) {
                const profile = data.getProfile

                const enrichedProfile = Object.assign({}, profile, { imgUrl: profile.imgUrl || 'default_profile.png' })

                return enrichedProfile;
            }

        } catch (err) {
            throwWithLabel(err, `services/apollo.getProfile`)
        }
    }
    /**
     * Triggers Query.getTweets with payload
     * @param {String} userId - user who's tweets we'd like to fetch
     * @param {Number} limit - tweets per page, defaults to 10
     * @param {String} nextToken - pagination token
     * @returns {Promise<TweetsPage>} - or { tweets: [...], nextToken: null | String}
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async getTweets({ userId, limit = 10, nextToken = null }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!userId) throw Error('Missing required param userId')

            if (!limit) throw Error('Missing required param limit')


            const GET_TWEETS = gql`${Queries.getTweets}`

            let queryParams = {
                query: GET_TWEETS,
                variables: {
                    userId,
                    limit
                }
            }

            if (nextToken) {
                queryParams.nextToken = nextToken
            }

            const { data, errors } = await this.client.query(queryParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            if (data) {
                return data.getTweets
            }

        } catch (err) {
            throwWithLabel(err, `services/apollo.getTweets`)
        }
    }

    /**
     * Triggers Query.getImageUploadUrl with payload
     * @param {String} extension - eg. .png | .jpeg
     * @param {String} contentType - eg, image/png | image/jpeg
     * @returns {Promise<ImageUploadUrlRes>} - or { url: AWSUrl, fileKey: String }
     * @throws {Error} Either with custom payloads or GraphQL errors
     */
    async getImgUploadUrl({ extension, contentType }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!extension || !contentType) throw Error("Missing required parameters.")

            const GET_IMAGE_UPLOADURL = gql`${Queries.getImageUploadUrl}`

            const queryParams = {
                query: GET_IMAGE_UPLOADURL,
                variables: {
                    extension,
                    contentType
                }
            }

            const { data, errors } = await this.client.query(queryParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            if (data) {
                return data.getImageUploadUrl
            }

        } catch (err) {
            throwWithLabel(err, `services/apollo.getImgUploadUrl`)
        }

    }
    /**
     * Triggers Mutation.updateMyProfile with payload
     * @param {MyProfile} profile 
     * @returns {Promise<MyProfile>}
     * @throws {Error} Either with custom payloads or GraphQL errors
     */
    async updateMyProfile(profile) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!profile) throw Error("Missing required parameter.")

            const EDIT_PROFILE = gql`${Mutations.editMyProfile}`

            const mutationParams = {
                mutation: EDIT_PROFILE,
                variables: {
                    newProfile: {
                        ...profile
                    }
                }
            }

            const { data, errors } = await this.client.mutate(mutationParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            if (data) {
                return data.editMyProfile
            }
        } catch (err) {
            throwWithLabel(err, `services/apollo.updateMyProfile`)
        }
    }

    /**
     * Triggers Query.getFollowing with payload
     * @param {String} userId - user who's following we'd like to fetch
     * @param {Number} limit - following users per page, defaults to 10
     * @param {String} nextToken - pagination token
     * @returns {Promise<ProfilesPage>} - eg { profiles: [], nextToken: String }
     * @throws {Error} Either with custom payloads or GraphQL errors
     */
    async getFollowing({ userId, limit = 10, nextToken = null }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!userId) throw Error("Missing required parameters.")

            const GET_FOLLOWING = gql`${Queries.getFollowing}`

            let queryParams = {
                query: GET_FOLLOWING,
                variables: {
                    userId,
                    limit
                }
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
                return data.getFollowing
            }
        } catch (err) {
            throwWithLabel(err, `services/apollo.getFollowing`)
        }
    }
    /**
     * Triggers Query.getFollowers with payload
     * @param {String} userId - user who's followers we'd like to fetch
     * @param {Number} limit - followers users per page, defaults to 10
     * @param {String} nextToken - pagination token
     * @returns {Promise<ProfilesPage>} - eg { profiles: [], nextToken: String }
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async getFollowers({ userId, limit = 10, nextToken = null }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!userId) throw Error("Missing required parameters.")

            const GET_FOLLOWERS = gql`${Queries.getFollowers}`

            let queryParams = {
                query: GET_FOLLOWERS,
                variables: {
                    userId,
                    limit
                }
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
                return data.getFollowers
            }

        } catch (err) {
            throwWithLabel(err, `services/apollo.getFollowers`)
        }
    }

    /**
     * Triggers Mutation.follow with payload
     * @param {String} userId - user to be followed
     * @returns {Promise<Boolean>}
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async follow({ userId }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!userId) throw Error("Missing required parameters.")

            const FOLLOW = gql`${Mutations.follow}`

            const mutationParam = {
                mutation: FOLLOW,
                variables: {
                    userId
                }
            }

            const { data, errors } = await this.client.mutate(mutationParam)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            return data && data.follow

        } catch (err) {
            throwWithLabel(err, `services/apollo.follow`)
        }
    }

    /**
     * Triggers Mutation.unfollow with payload
     * @param {String} userId - user to be unfollowed
     * @returns {Promise<Boolean>}
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async unfollow({ userId }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!userId) throw Error("Missing required parameters.")

            const UNFOLLOW = gql`${Mutations.unfollow}`

            const mutationParam = {
                mutation: UNFOLLOW,
                variables: {
                    userId
                }
            }

            const { data, errors } = await this.client.mutate(mutationParam)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            return data && data.unfollow

        } catch (err) {
            throwWithLabel(err, `services/apollo.unfollow`)
        }
    }

    /**
     * Triggers Query.search with payload
     * @param {String} query - query to execute the search with
     * @param {SearchMode} mode - SearchMode eg Latest | People
     * @param {Number} limit - no of search results per page, default 25
     * @param {String} givenNextToken - pagination token
     * @returns {Promise<SearchResultsPage>}  eg {results: [SearchResult!], nextToken: String, totalCount: Int!}
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async search({ query, mode, limit = 25, givenNextToken = null }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!query && !mode) throw Error("Missing required parameters.")

            const SEARCH = gql`${Queries.search}`

            const queryParams = {
                query: SEARCH,
                variables: {
                    query,
                    mode,
                    limit,
                    nextToken: givenNextToken
                }
            }

            const { data, errors } = await this.client.query(queryParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            return data && data.search
        } catch (err) {
            throwWithLabel(err, `services/apollo.search`)
        }
    }

    /**
     * Triggers Query.searchHashtags with payload
     * @param {String} query - query to execute the hashtag search with
     * @param {HashtagsMode} mode - HashtagsMode eg Latest | People
     * @param {Number} limit - no of search results per page, default 25
     * @param {String} givenNextToken - pagination token
     * @returns {Promise<HashtagsResultsPage>}  eg {results: [HashtagResult!], nextToken: String, totalCount: Int!}
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async searchHashtags({ query, mode, limit = 25, givenNextToken = null }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!query && !mode) throw Error("Missing required parameters.")

            const SEARCH_HASHTAGS = gql`${Queries.searchHashtags}`

            const queryParams = {
                query: SEARCH_HASHTAGS,
                variables: {
                    hashtags: query,
                    mode,
                    limit,
                    nextToken: givenNextToken
                }
            }

            const { data, errors } = await this.client.query(queryParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            return data && data.searchHashtags
        } catch (err) {
            throwWithLabel(err, `services/apollo.searchHashtags`)
        }
    }

    /**
     * Triggers Subscribe.onNotified with payload
     * @param {String} userId - userId for the notifications
     * @param {String} type - Retweeted | Liked | Mentioned | Replied | DMed
     * @returns {Promise<Notification>} async Notification type structure
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async onNotified({ userId, type }) {
        try {

            if (!this.client) throw Error("Cannot find required Appsync client")

            if (!userId) throw Error("Missing required parameters.")

            const ON_NOTIFIED = gql`${Subscriptions.onNotified}`

            let subscriptionParams = {
                query: ON_NOTIFIED,
                variables: {
                    userId
                },
                errorPolicy: 'all'
            }

            if (type) {
                subscriptionParams.variables = {
                    userId,
                    type
                }
            }

            const observable = this.client.subscribe(subscriptionParams)

            return observable
        } catch (caught) {
            throwWithLabel(caught, `GraphQL.onNotified`)
        }
    }
    /**
     * Triggers Query.listConversations with payload
     * @param {Number} limit - no of conversation results per page, default 10
     * @param {String} givenNextToken - pagination token
     * @returns {Promise<ConversationsPage>}  eg {conversations: [Conversation!], nextToken: String}
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async listConversations({ limit = 10, givenNextToken = null }) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")
            
            if (!limit) throw Error("Missing required parameters.")

            const LIST_CONVERSATIONS = gql`${Queries.listConversations}`

            const queryParams = {
                query: LIST_CONVERSATIONS,
                variables: {
                    limit,
                    nextToken: givenNextToken
                }
            }

            const { data, errors } = await this.client.query(queryParams)

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }

            return data && data.listConversations
        } catch (err) {
            throwWithLabel(err, `services/apollo.listConversations`)
        }
    }

    /**
     * Triggers Query.getDirectMessages with payload
     * @param {Object} variables - The getDirectMessages() query params
     * @param {String} variables.otherUserId - the correspondent 
     * @param {String} variables.limit - max 25
     * @param {String} variables.nextToken - optional string value
     * @returns {Promise<MessagesPage>} async MessagesPage type structure
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async getDirectMessages(variables) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")
            const GET_DMS = gql`
                query getDirectMessages($otherUserId: ID!, $limit: Int!, $nextToken: String) {
                    getDirectMessages(
                        otherUserId: $otherUserId
                        limit: $limit,
                        nextToken: $nextToken
                    ) {
                        nextToken
                        messages {
                            messageId
                            message
                            timestamp
                            from {
                                ... otherProfileFields
                                ... myProfileFields
                                tweets {
                                    nextToken
                                    tweets {
                                        ... iTweetFields
                                    }
                                }
                            }
                        }
                    }
                }
                ${otherProfileFrag},
                ${myProfileFrag},
                ${iProfileFrag},
                ${tweetFrag},
                ${retweetFrag},
                ${replyFrag},
                ${iTweetFrag},
            `;

            const { data, errors } = await this.client.query({
                query: GET_DMS,
                variables,
                errorPolicy: 'all'
            })
            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }
            if (data) {
                return data.getDirectMessages
            };

        } catch (caught) {
            throwWithLabel(caught, `GraphQL.getDirectMessages`)
        }
    }

    /**
     * Triggers Mutation.sendDirectMessage with payload
     * @param {Object} variables - The sendDirectMessage() query params
     * @param {String} variables.otherUserId - message destination user
     * @param {String} variables.message - message content
     * @returns {Promise<Conversation>} async Conversation type structure
     * @throws {Error} Either with custom payloads or GraphQL errors
     */

    async sendDirectMessage(variables) {
        try {
            if (!this.client) throw Error("Cannot find required Appsync client")
            const SEND_DIRECT_MESSAGE = gql`
                mutation sendDirectMessage($otherUserId: ID!, $message: String!) {
                    sendDirectMessage(
                        otherUserId: $otherUserId,
                        message: $message
                    ) {
                        id
                        lastMessage
                        lastModified
                        otherUser {
                            ... otherProfileFields
                            tweets {
                                nextToken
                                tweets {
                                    ... iTweetFields
                                }
                            }
                        }
                    }
                }
                ${otherProfileFrag},
                ${tweetFrag},
                ${iTweetFrag},
                ${iProfileFrag},
                ${retweetFrag},
                ${replyFrag},
                ${myProfileFrag}
            `;

            const { data, errors } = await this.client.mutate({
                mutation: SEND_DIRECT_MESSAGE,
                variables,
                errorPolicy: 'all'
            })

            if (errors) {
                console.error('GraphQL Errors :', JSON.stringify(errors))
                throwWithLabel(new Error('GraphQL Errors'), 'GraphQL Errors detected')
            }
            if (data) {
                return data.sendDirectMessage
            };

        } catch (caught) {
            throwWithLabel(caught, `GraphQL.sendDirectMessage`)
        }
    }
}

