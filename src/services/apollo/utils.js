const fragments = {}
const registerFragment = (name, fragment) => fragments[name] = fragment

export const myProfileFrag = `
fragment myProfileFields on MyProfile {
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
}
`

export const otherProfileFrag = `
fragment otherProfileFields on OtherProfile {
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
    following
    followedBy
}
`

export const iProfileFrag = `
fragment iProfileFields on IProfile {
    ... on MyProfile {
        ... myProfileFields
    }

    ... on OtherProfile {
        ... otherProfileFields
    }
}
`

export const tweetFrag = `
fragment tweetFields on Tweet {
    id
    profile {
        ... iProfileFields
    }
    createdAt
    text
    replies
    likes
    retweets
    liked
    retweeted
}
`

export const retweetFrag = `
fragment retweetFields on Retweet {
    id
    profile {
        ... iProfileFields
    }
    createdAt
    retweetOf {
        ... on Tweet {
            ... tweetFields
        }
    }
}
`

export const replyFrag = `
fragment replyFields on Reply {
    id
    profile {
        ... iProfileFields
    }
    createdAt
    text
    replies
    likes
    retweets
    liked
    retweeted   
    inReplyToTweet {
        id 
        profile {
            ... iProfileFields
        }
        createdAt
        ... on Tweet {
            replies
            liked
            retweeted
        }

        ... on Reply {
            replies
            liked
            retweeted
        }
    }
    inReplyToUsers {
        ... iProfileFields
    }
}
`

export const iTweetFrag = `
fragment iTweetFields on ITweet {
    ... on Tweet {
        ... tweetFields
    }

    ... on Retweet {
        ... retweetFields
    }

    ... on Reply {
        ... replyFields
    }
}
`

export function registerAllFragments () {
    registerFragment('myProfileFields', myProfileFrag);
    registerFragment('otherProfileFields', otherProfileFrag);
    registerFragment('iProfileFields', iProfileFrag);
    registerFragment('tweetFields', tweetFrag);
    registerFragment('iTweetFields', iTweetFrag)
    registerFragment('retweetFields', retweetFrag)
    registerFragment('replyFields', replyFrag)
}
