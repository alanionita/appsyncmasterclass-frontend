import { defineStore } from 'pinia';
import { ulid } from 'ulid'
import * as gql from '@/services/graphql/controllers'
import { SEARCH_MODES, ROUTE_NAMES } from '@/utils/constants';

export const useSearch = defineStore('search', {
    state: () => ({
        query: '',
        mode: SEARCH_MODES.latest,
        results: [],
        nextToken: null,
        limit: 10,
        totalCount: 0,
        hasMore: true,
        fetchedCount: 0
    }),
    actions: {
        async handleSearch(router) {
            if (this.query && this.query.length > 0) {
                const resp = await gql.search({
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
                    name: ROUTE_NAMES.Search,
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
            this.handleSearch(router);
        },
        async loadMore() {
            try {
                if (this.hasMore) {
                    if (!this.nextToken) return
                    const tweetsLeft = this.totalCount - this.fetchedCount
                    const perPage = tweetsLeft >= this.limit ? this.limit : tweetsLeft
                    if (perPage < this.limit) {
                        this.hasMore = false
                    }

                    const resp = await gql.search({
                        query: this.query,
                        mode: this.mode,
                        limit: this.limit,
                        givenNextToken: this.nextToken
                    })

                    const { results } = resp;

                    this.results = [...this.results, ...results]
                    this.fetchedCount += results.length
                    if (!this.nextToken) {
                        this.nextToken = null
                        this.hasMore = false
                    } else {
                        this.nextToken = this.nextToken
                    }
                }
            } catch (err) {
                console.error('Err [search.loadMore] ::', err.message)
                console.info(JSON.stringify(err))
            }
        },
        reset() {
            this.results = [];
            this.nextToken = null;
            this.totalCount = 0;
            this.hasMore = true;
            this.fetchedCount = 0;
        }
    },
    getters: {
    },
});