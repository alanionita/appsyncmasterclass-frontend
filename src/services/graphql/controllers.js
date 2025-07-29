import * as Queries from "@/services/appsync/queries";
import * as Mutations from "@/services/appsync/mutations";
import * as gql from "./utils";

export const getMyProfile = async () => {
  try {
    const res = await gql.query({ queryStr: Queries.getMyProfile })

    const profile = res.data.getMyProfile;

    profile.imgUrl = profile.imgUrl || 'default_profile.png'

    return profile
  } catch (err) {
    console.info('Error [getMyProfile] :', err.message)
  }
}

export const getMyTimeline = async (limit = 10, nextToken = null) => {
  try {
    const queryParam = {
      queryStr: Queries.getMyTimeline,
      variables: {
        limit
      }
    }

    if (nextToken) {
      queryParam.variables["nextToken"] = nextToken
    }

    const res = await gql.query(queryParam)

    const timeline = res.data.getMyTimeline;

    return timeline
  } catch (err) {
    console.info('Error [gql/controllers/getMyTimeline] :', err.message)
  }
}

export const postTweet = async (text) => {
  try {
    if (!text) throw Error('Missing required param text')

    const queryParam = {
      queryStr: Mutations.tweet,
      variables: {
        text
      }
    }

    const res = await gql.query(queryParam)
    return res.data.tweet

  } catch (err) {
    console.info('Error [gql/controllers/postTweet] :', err.message)
  }
}

export const likeTweet = async (tweetId) => {
  try {
    if (!tweetId) throw Error('Missing required param tweetId')

    const queryParam = {
      queryStr: Mutations.like,
      variables: {
        tweetId
      }
    }

    const res = await gql.query(queryParam)
    return res.data

  } catch (err) {
    console.info('Error [gql/controllers/likeTweet] :', err.message)
  }
}

export const unlikeTweet = async (tweetId) => {
  try {
    if (!tweetId) throw Error('Missing required param tweetId')

    const queryParam = {
      queryStr: Mutations.unlike,
      variables: {
        tweetId
      }
    }

    const res = await gql.query(queryParam)
    return res.data

  } catch (err) {
    console.info('Error [gql/controllers/unlikeTweet] :', err.message)
  }
}