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
        limit: 10
    }),
    actions: {
        async handleSearch(router) {
            if (this.query && this.query.length > 0) {
                const resp = await gql.search({
                    query: this.query,
                    mode: this.mode,
                    limit: this.limit
                })

                const { results, nextToken} = resp;

                this.results = results;
                this.nextToken = nextToken;
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
        }
    },
    getters: {
    },
});