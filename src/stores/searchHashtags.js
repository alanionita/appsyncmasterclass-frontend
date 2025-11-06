import { defineStore } from 'pinia';
import { ulid } from 'ulid'
import { SEARCH_MODES, ROUTE_NAMES } from '@/utils/constants';

export const useSearchHashtags = defineStore('searchHashtags', {
    state: () => ({
        query: '',
        mode: SEARCH_MODES.latest,
    }),
    actions: {
        async handleSearchHashtags(router) {
            if (this.query && this.query.length > 0) {
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
        firstLoad: state => state.fetchedCount === 0 && state.totalCount === 0 && state.hasMore === true
    },
});