import * as Queries from "@/services/appsync/queries";
import * as gql from "./utils";

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