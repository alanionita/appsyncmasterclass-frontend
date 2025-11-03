import { defineStore } from 'pinia';
import { ulid } from 'ulid'
import { SEARCH_MODES, SUBMIT_DELAY, ROUTE_NAMES } from '@/utils/constants';
import { debounce } from '@/utils/timing';

export const useSearch = defineStore('search', {
    state: () => ({
        query: '',
        mode: SEARCH_MODES.latest,
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
            debounce(cb(_router, this.query, this.mode), SUBMIT_DELAY)()
        }
    },
    getters: {
    },
});