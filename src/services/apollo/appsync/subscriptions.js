/* eslint-disable */

export const onNotified = /* GraphQL */ `
  subscription OnNotified($userId: ID!, $type: NotificationType) {
    onNotified(userId: $userId, type: $type) {
      ... on iNotification {
          id
          type
          userId
          createdAt
          profile {
              ... on MyProfile {
                  id
                  name
                  screenName
                  imgUrl
              }
              ... on OtherProfile {
                  id
                  name
                  screenName
                  imgUrl
              } 
          }
      }
  
      ... on Retweeted {
          tweetId
          retweetedBy
          retweetId
      }

      ... on Liked {
          tweetId
          likedBy
      }

      ... on Replied {
          tweetId
          replyTweetId
          repliedBy
      }

      ... on Mentioned {
          mentionedBy
          mentionedByTweetId
      }

      ... on DMed {
          otherUserId
          message
      }
    }
  }
`;
