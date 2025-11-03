import { defineStore } from 'pinia';
import { ulid } from 'ulid'
import { SEARCH_MODES, ROUTE_NAMES } from '@/utils/constants';

export const useSearch = defineStore('search', {
    state: () => ({
        query: '',
        mode: SEARCH_MODES.latest,
        results: [],
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