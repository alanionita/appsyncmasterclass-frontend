import { NOTIFICATION_MODES, ROUTE_NAMES } from '@/utils/constants';
import { defineStore } from 'pinia';
import { ulid } from 'ulid';

const defaultState = {
    all: [],
    mentions: [],
    newNotifications: 0,
    subscription: null,
    mode: NOTIFICATION_MODES.all
}

export const useNotifications = defineStore('notifications', {
    state: () => defaultState,
    actions: {
        reset() {
            this.all = defaultState.all;
            this.mentions = defaultState.mentions;
            this.newNotifications = defaultState.newNotifications
            this.subscription = defaultState.subscription
            this.mode = defaultState.mode
        },
        changeMode(router, newMode) {
            if (NOTIFICATION_MODES[newMode]) {
                this.reset()
                this.mode = NOTIFICATION_MODES[newMode];
                this.handleNotifications(router);
                return
            } else {
                return 
            }
        },
        async handleNotifications(router) {
            router.push({
                name: ROUTE_NAMES.NOTIFICATION_MODES,
                query: {
                    m: this.mode,
                    h: ulid()
                }
            })
        },
    }
});