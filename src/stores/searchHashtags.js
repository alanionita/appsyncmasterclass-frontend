import { defineStore } from 'pinia';
import { ulid } from 'ulid'
import { SEARCH_MODES, ROUTE_NAMES } from '@/utils/constants';
import * as gql from '@/services/graphql/controllers'
import { useUi } from './ui';

export const useSearchHashtags = defineStore('searchHashtags', {
    state: () => ({
        query: '',
        mode: SEARCH_MODES.latest,
        results: null,
        nextToken: null,
        limit: 10,
        fetchedCount: 0,
        totalCount: 0,
        hasMore: true
    }),
    actions: {
        async handleSearchHashtags(router) {
            try {
                if (this.query && this.query.length > 0) {
                    const resp = await gql.searchHashtags({
                        query: this.query,
                        mode: this.mode,
                        limit: this.limit
                    })

                    const { results, nextToken, totalCount } = resp;

                    this.results = results;
                    this.nextToken = nextToken;
                    this.totalCount = totalCount;
                    this.fetchedCount += results.length;

                    if (totalCount <= results.length) {
                        this.hasMore = false
                    }

                    router.push({
                        name: ROUTE_NAMES.Hashtag,
                        query: {
                            q: this.query,
                            m: this.mode,
                            h: ulid()
                        }
                    })
                }

            } catch (err) {
                console.error(' Err [stores/searchHashtags] :', err.message)
                console.info(JSON.stringify(err))
            }
        },
        async changeMode(router, newMode) {
            this.reset()
            this.mode = newMode;
            await this.handleSearchHashtags(router);
        },
        reset() {
            this.results = null;
            this.nextToken = null;
            this.totalCount = 0;
            this.hasMore = true;
            this.fetchedCount = 0;
        }
    },
    getters: {
        firstLoad: state => state.fetchedCount === 0 && state.totalCount === 0 && state.hasMore === true
    },
});