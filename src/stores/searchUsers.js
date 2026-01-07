import { defineStore } from 'pinia';
import { SEARCH_MODES } from '@/utils/constants';
import { useAppsync } from './appsync';

export const useSearchUsers = defineStore('searchUsers', {
    state: () => ({
        query: '',
        mode: SEARCH_MODES.people,
        results: [],
        nextToken: null,
        limit: 10,
        totalCount: 0,
        hasMore: true,
        fetchedCount: 0
    }),
    actions: {
        async handleSearch() {
            const { appsyncClient } = useAppsync()
            if (this.query && this.query.length > 0) {
                const resp = await appsyncClient.search({
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
            }
        },
        async loadMore() {
            try {
                const { appsyncClient } = useAppsync()
                if (this.hasMore) {
                    if (!this.nextToken) return
                    const tweetsLeft = this.totalCount - this.fetchedCount
                    const perPage = tweetsLeft >= this.limit ? this.limit : tweetsLeft
                    if (perPage < this.limit) {
                        this.hasMore = false
                    }

                    const resp = await appsyncClient.search({
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
                console.error('Err [searchUsers.loadMore] ::', err.message)
                console.info(JSON.stringify(err))
            }
        },
        reset() {
            this.query = ''
            this.results = [];
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