import { defineStore } from 'pinia';
import { ulid } from 'ulid'
import { SEARCH_MODES, ROUTE_NAMES } from '@/utils/constants';
import * as gql from '@/services/graphql/controllers'

export const useSearchHashtags = defineStore('searchHashtags', {
    state: () => ({
        query: '',
        mode: SEARCH_MODES.latest,
        results: [],
        nextToken: null,
        limit: 10,
        fetchedCount: 0
    }),
    actions: {
        async handleSearchHashtags(router) {
            if (this.query && this.query.length > 0) {
                const resp = await gql.searchHashtags({
                    query: this.query,
                    mode: this.mode,
                    limit: this.limit
                })

                const { results, nextToken } = resp;

                this.results = results;
                this.nextToken = nextToken;
                this.fetchedCount += results.length;

                router.push({
                    name: ROUTE_NAMES.Hashtag,
                    query: {
                        q: this.query,
                        m: this.mode,
                        h: ulid()
                    }
                })
            }
        },
        changeMode(router, newMode) {
            this.mode = newMode;
            this.handleSearchHashtags(router);
        },
    },
    getters: {
    },
});