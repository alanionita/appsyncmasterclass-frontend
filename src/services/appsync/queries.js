/* eslint-disable */
export const getImageUploadUrl = /* GraphQL */ `
  query GetImageUploadUrl($extension: String, $contentType: String) {
    getImageUploadUrl(extension: $extension, contentType: $contentType)
  }
`;
export const getMyProfile = /* GraphQL */ `
  query GetMyProfile {
    getMyProfile {
      id
      name
      screenName
      imgUrl
      bgImgUrl
      bio
      location
      website
      birthdate
      createdAt
      tweets {
        nextToken
        __typename
      }
      followersCount
      followingCount
      tweetsCount
      likesCount
      __typename
    }
  }
`;
export const getMyTimeline = /* GraphQL */ `
  query GetMyTimeline($limit: Int!, $nextToken: String) {
    getMyTimeline(limit: $limit, nextToken: $nextToken) {
      tweets {
        id
        createdAt
        profile {
          name
          screenName
          imgUrl
        }
    
        ... on Tweet {
          text
          replies
          likes
          retweets
          liked
          retweeted
          profile {
            name
            screenName
            imgUrl
          }
        }
        ... on Reply {
          text
          replies
          likes
          retweets
          liked
          retweeted
          profile {
            name
            screenName
            imgUrl
          }
          inReplyToTweet {
            createdAt
            id
          }
          inReplyToUsers {
            name
            screenName
            id
          }
        }
      }
      nextToken
      __typename
    }
  }
`;
export const getProfile = /* GraphQL */ `
  query GetProfile($screenName: String!) {
    getProfile(screenName: $screenName) {
      id
      name
      screenName
      imgUrl
      bgImgUrl
      bio
      location
      website
      birthdate
      createdAt
      tweets {
        nextToken
        __typename
      }
      followersCount
      followingCount
      tweetsCount
      likesCount
      following
      followedBy
      __typename
    }
  }
`;
export const getTweets = /* GraphQL */ `
  query GetTweets($userId: ID!, $limit: Int!, $nextToken: String) {
    getTweets(userId: $userId, limit: $limit, nextToken: $nextToken) {
      tweets {
        id
        createdAt

        ... on Tweet {
          text
          replies
          likes
          retweets
          liked
          retweeted
        }
        ... on Reply {
          text
          replies
          likes
          retweets
          liked
          retweeted
        }
      }
      nextToken
      __typename
    }
  }
`;
export const getLikes = /* GraphQL */ `
  query GetLikes($userId: ID!, $limit: Int!, $nextToken: String) {
    getLikes(userId: $userId, limit: $limit, nextToken: $nextToken) {
      tweets {
        id
        createdAt

        ... on Tweet {
          text
          replies
          likes
          retweets
          liked
          retweeted
        }
        ... on Reply {
          text
          replies
          likes
          retweets
          liked
          retweeted
        }
      }
      nextToken
      __typename
    }
  }
`;
export const getFollowers = /* GraphQL */ `
  query GetFollowers($userId: ID!, $limit: Int!, $nextToken: String) {
    getFollowers(userId: $userId, limit: $limit, nextToken: $nextToken) {
      profiles {
        id
        name
        screenName
        imgUrl
        bgImgUrl
        bio
        location
        website
        birthdate
        createdAt
        followersCount
        followingCount
        tweetsCount
        likesCount

        ... on OtherProfile {
          following
          followedBy
        }
      }
      nextToken
      __typename
    }
  }
`;
export const getFollowing = /* GraphQL */ `
  query GetFollowing($userId: ID!, $limit: Int!, $nextToken: String) {
    getFollowing(userId: $userId, limit: $limit, nextToken: $nextToken) {
      profiles {
        id
        name
        screenName
        imgUrl
        bgImgUrl
        bio
        location
        website
        birthdate
        createdAt
        followersCount
        followingCount
        tweetsCount
        likesCount

        ... on OtherProfile {
          following
          followedBy
        }
      }
      nextToken
      __typename
    }
  }
`;
