import { NOTIFICATION_MODES, ROUTE_NAMES } from '@/utils/constants';
import { defineStore } from 'pinia';
import { ulid } from 'ulid';
import { useTwitterMyProfile } from './twitterMyProfile';
import { useAppsync } from './appsync';
import { throwWithLabel } from '@/utils/error';

const defaultState = {
    all: [],
    mentions: [],
    newBadge: 0,
    subscription: null,
    mode: NOTIFICATION_MODES.all
}

export const useNotifications = defineStore('notifications', {
    state: () => Object.assign({}, defaultState),
    actions: {
        async reset() {
            if (this.subscription && this.subscription.closed === false) {
                await this.unsubscribe()
            }
            this.all = defaultState.all;
            this.mentions = defaultState.mentions;
            this.newBadge = defaultState.newBadge
            this.subscription = defaultState.subscription
            this.mode = defaultState.mode
        },
        resetBadge() {
            this.newBadge = defaultState.newBadge;
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
        addNotification(notification) {
            if (notification) {
                if (notification.type === "Mentioned") {
                    this.mentions = [notification, ...this.mentions];
                }
                this.all = [notification, ...this.all]
                this.newBadge += 1
            }
        },
        async subscribe() {
            try {
                if (this.subscription && !this.subscription.closed) {
                    this.subscription.unsubscribe()
                }
                const { appsyncClient } = useAppsync()
                const myProfile = useTwitterMyProfile();

                const onNotifiedVars = {
                    userId: myProfile.id
                }
                const observable = await appsyncClient.onNotified(onNotifiedVars);
                const _addNotification = this.addNotification.bind(this)
                this.subscription = observable.subscribe({
                    next({ data, error }) {
                        if (data) {
                            const { onNotified } = data;
                            return _addNotification(onNotified)
                        }
                        if (error) {
                            console.error('Subscription next / error ', error)
                        }
                    },
                    error(error) {
                        console.error('Subscription error:', error);
                        console.info('NetworkError:', error.networkError);
                        console.info('GraphQLErrors:', error.graphQLErrors);

                    },
                    complete() {
                        console.info('Subscription completed');
                    }
                });
            } catch (err) {
                throwWithLabel(err, 'stores/notifications/subscribe')
            }

        },
        async unsubscribe() {
            try {
                if (this.subscription) {
                    await this.subscription.unsubscribe();

                    if (this.subscription.closed) {
                        this.subscription = null
                    }
                }

            } catch (err) {
                throwWithLabel(err, 'stores/notifications/unsubscribe')
            }
        },
        async handleNotifications(router) {
            router.push({
                name: ROUTE_NAMES.Notifications,
                query: {
                    m: this.mode,
                    h: ulid()
                }
            })
        },
    },
    getters: {
        isSubClosed: state => state.subscription && state.subscription.closed,
        hasSub: state => state.subscription && state.subscription === null
    }
});