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

export const retweetTweet = async (tweetId) => {
  try {
    if (!tweetId) throw Error('Missing required param tweetId')

    const queryParam = {
      queryStr: Mutations.retweet,
      variables: {
        tweetId
      }
    }

    const res = await gql.query(queryParam)
    return res.data.retweet

  } catch (err) {
    console.info('Error [gql/controllers/retweetTweet] :', err.message)
  }
}

export const unretweetTweet = async (tweetId) => {
  try {
    if (!tweetId) throw Error('Missing required param tweetId')

    const queryParam = {
      queryStr: Mutations.unretweet,
      variables: {
        tweetId
      }
    }

    const res = await gql.query(queryParam)
    return res

  } catch (err) {
    console.info('Error [gql/controllers/unretweetTweet] :', err.message)
  }
}

export const postReply = async ({ tweetId, text }) => {
  try {
    if (!tweetId) throw Error('Missing required param tweetId')
    if (!text) throw Error('Missing required param text')

    const queryParam = {
      queryStr: Mutations.reply,
      variables: {
        tweetId,
        text
      }
    }

    const res = await gql.query(queryParam)

    return res.data.reply

  } catch (err) {
    console.info('Error [gql/controllers/postReply] :', err.message)
  }
}

export const getProfile = async ({ screenName }) => {
  try {
    const queryParam = {
      queryStr: Queries.getProfile,
      variables: {
        screenName
      }
    }

    const res = await gql.query(queryParam)

    const profile = res.data.getProfile;

    profile.imgUrl = profile.imgUrl || 'default_profile.png'

    return profile
  } catch (err) {
    console.error('Error [gql/controllers/getProfile] :', err.message)
  }
}

export const getTweets = async ({ userId, limit = 10, nextToken = null }) => {
  try {
    const queryParam = {
      queryStr: Queries.getTweets,
      variables: {
        userId,
        limit
      }
    }

    if (nextToken) {
      queryParam.variables["nextToken"] = nextToken
    }

    const res = await gql.query(queryParam)

    const timeline = res.data.getTweets;

    return timeline

  } catch (err) {
    console.error('Error [gql/controllers/getTweets] :', err.message)
  }
}


/**
 * Generates a presigned upload url on the backend
 * @param extension file extension
 * @param contentType .jpeg or .png
 * @returns Obj { url, fileKey } : presigned url to file, path to file
*/

export const getImgUploadUrl = async ({ extension, contentType }) => {
  try {
    if (!extension || !contentType) throw Error("Missing required parameters.")

    const queryParam = {
      queryStr: Queries.getImageUploadUrl,
      variables: {
        extension,
        contentType
      }
    }

    const res = await gql.query(queryParam)

    const data = res.data.getImageUploadUrl;
    
    return data

  } catch (err) {
    console.error('Error [gql/controllers/getImgUploadUrl] :', err.message)
  }
}

export const updateMyProfile = async (profile) => {
  try {
    if (!profile) throw Error("Missing required parameter.")
    const params = {
      queryStr: Mutations.editMyProfile,
      variables: {
        newProfile: {
          ...profile
        }
      }
    }

    const res = await gql.query(params)

    const newProfile = res.data.editMyProfile;

    return newProfile

  } catch (err) {
    console.error('Error [gql/controllers/editMyProfile] :', err.message)
  }
}

export const getFollowing = async ({ userId, limit = 10, nextToken = null }) => {
  try {
    const queryParam = {
      queryStr: Queries.getFollowing,
      variables: {
        userId,
        limit
      }
    }

    if (nextToken) {
      queryParam.variables["nextToken"] = nextToken
    }

    const res = await gql.query(queryParam)

    const following = res.data.getFollowing;

    return following

  } catch (err) {
    console.error('Error [gql/controllers/getFollowing] :', err.message)
  }
}

export const getFollowers = async ({ userId, limit = 10, nextToken = null }) => {
  try {
    const queryParam = {
      queryStr: Queries.getFollowers,
      variables: {
        userId,
        limit
      }
    }

    if (nextToken) {
      queryParam.variables["nextToken"] = nextToken
    }

    const res = await gql.query(queryParam)

    const followers = res.data.getFollowers;

    return followers

  } catch (err) {
    console.error('Error [gql/controllers/getFollowers] :', err.message)
  }
}

export const follow = async ({ userId }) => {
  try {
    const queryParam = {
      queryStr: Mutations.follow,
      variables: {
        userId
      }
    }

    const res = await gql.query(queryParam)

    return res

  } catch (err) {
    console.error('Error [gql/controllers/follow] :', err.message)
    return err
  }
}

export const unfollow = async ({ userId }) => {
  try {
    const queryParam = {
      queryStr: Mutations.unfollow,
      variables: {
        userId
      }
    }

    const res = await gql.query(queryParam)

    return res

  } catch (err) {
    console.error('Error [gql/controllers/unfollow] :', err.message)
    return err
  }
}

export const search = async ({ query, mode, limit = 25, givenNextToken = null }) => {
  try {
    const queryParam = {
      queryStr: Queries.search,
      variables: {
        query, 
        mode,
        limit,
        nextToken: givenNextToken
      }
    }

    const res = await gql.query(queryParam)

    const searchResults = res.data.search;

    return searchResults

  } catch (err) {
    console.error('Error [gql/controllers/search] :', err.message)
    return err
  }
}