import * as Queries from "@/services/appsync/queries";
import * as Mutations from "@/services/appsync/mutations";
import * as gql from "./utils";

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

export const searchHashtags = async ({ query, mode, limit = 25, givenNextToken = null }) => {
  try {
    const queryParam = {
      queryStr: Queries.searchHashtags,
      variables: {
        hashtags: query, 
        mode,
        limit,
        nextToken: givenNextToken
      }
    }

    const res = await gql.query(queryParam)

    const searchResults = res.data.searchHashtags;

    return searchResults

  } catch (err) {
    console.error('Error [gql/controllers/searchHashtags] :', err.message)
    return err
  }
}