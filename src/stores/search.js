import { defineStore } from 'pinia';
import { ulid } from 'ulid'
import { SEARCH_MODES, ROUTE_NAMES } from '@/utils/constants';

export const useSearch = defineStore('search', {
    state: () => ({
        query: '',
        mode: SEARCH_MODES.latest,
        results: [
            { 
                "id": "01K8WXSZ7YWBY1E74SS3JXRH8A", 
                "createdAt": "2025-10-31T10:42:55.358Z", 
                "profile": { 
                    "name": "Alan No.1", 
                    "screenName": "AlanUJYB07IN", 
                    "imgUrl": "https://appsyncmasterclass-backend-dev-assetsbucket-uzasvskxkdto.s3.eu-west-2.amazonaws.com/b68292f4-a051-7097-86cf-c994703ce4ea/01K4CX3M6VX5ARN7P19ANZ9EA0.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAVATSEDXKPJIUI2E3%2F20251103%2Feu-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251103T222955Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMiJHMEUCIGzxOIXnkdOby4ujtuXQvAiecU5xjLW9uWikQ20CpqsCAiEAxeumf1%2BjhYwvUmcxkzX21NG%2BBinBGH6aTKKknwSpzaEquwMIaBADGgwzNDQ5MTA0NzA2MTIiDE6YbpoyCDkCAzMPtyqYA9z8TS8f%2B0C%2F35BOtYJ%2BunWlnkxe%2B%2BDdreCcvKXDUsYRgH4Egz%2BIObE4vTO7sYpgulmeyCiRgDxKiCNn9VXPzy21YKL9efal8MWDQlPAtJf5twGQou2zrXTsmB8U69hUR2Zw2beuyHVapu97E3pdBnitieSRT7ee4rRU%2FCxTSPFJxgiJ4l0Zbp0VHVVvn%2BrAOuzeqAx2v8Jcifwr6QfYyUgcoRrW1mnVT7FKYtY3%2FJmmK55ZlXC7DH424oK8WTxjyYEwzLNsXvofZUKADoan4gqsuq%2Fk5hACbgDnHcQItW1zp2Qs%2BaXwLizEgpCsi0UNRuK7vzasbjk5wXkt2RfGfcaoBSNcInwSPQy0KB6UmFiht7UlnwPZzRpD9bmcC%2Fcpt1yvtPrEhYLQuDIA2QmicxwOCM5N8AQPDjTXIs2%2BISglLaTnP9WJ821BlKqxtsKXUMEMIYjNbLbRm03002WTYgLmgCTaTsyZg9crB1Cni%2B1Oc%2BIjVKqA94mqwpbHK1mEVPaF%2BJ3a82ZH6PPMgi0mVyUaQ3d6xRcYVjD42KTIBjqeARtmkguC8cxgqj0YGKqUF2lyBSupk1PkHPUGyYLUXSd8MpPYR5I6qGSKnfYz9BPDSCM0j20TVApFpWcsLvtNnVQBurbW8Xp2aMIowKdpycr%2FWdvoWK78PeLtGRtEJO%2BneoNC7TK9cwJISuPxIeZ0hxsJlMr%2BcMMvnmT%2FwZi%2BjQEx1YWL6i%2Fk%2FUWlPiKLbdLqcIM1GY7v%2B2Zjp%2BKY7WRN&X-Amz-Signature=c09b0e180e6db787579b2ad016c1d1d41a61a01442d0625a1e775e24c0ea68c1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject" 
                }, 
                "text": "Tweet 21", 
                "replies": 0, 
                "likes": 0, 
                "retweets": 0, 
                "liked": false, 
                "retweeted": false 
            }
        ]
    }),
    actions: {
        handleSearch(_router) {
            const cb = (router, query, mode) => {
                if (query && query.length > 0) {
                    router.push({
                        name: ROUTE_NAMES.Search,
                        query: {
                            q: query,
                            m: mode,
                            h: ulid()
                        }
                    })
                }
            }
            cb(_router, this.query, this.mode)
        },
        changeMode(router, newMode) {
            this.mode = newMode;
            this.handleSearch(router);
        }
    },
    getters: {
    },
});