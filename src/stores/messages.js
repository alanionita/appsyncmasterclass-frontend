import { NOTIFICATION_MODES, ROUTE_NAMES } from '@/utils/constants';
import { defineStore } from 'pinia';
import { ulid } from 'ulid';
import { useTwitterMyProfile } from './twitterMyProfile';
import { useAppsync } from './appsync';
import { throwWithLabel } from '@/utils/error';
import { useUi } from './ui';

const defaultState = {
    conversations: [],
    nextToken: null,
    limit: 10,
    totalCount: 0,
    hasMore: true,
    fetchedCount: 0,
    newBadge: 0,
    conversationsSet: new Set(),
    active: {
        conversation: null,
        messages: [],
        nextTokenMessages: null,
    },
}

export const useMessages = defineStore('messages', {
    state: () => Object.assign({}, defaultState),
    actions: {
        async reset() {
            this.conversations = [];
            this.nextToken = null;
            this.newBadge = 0
            this.conversationsSet = new Set()
            this.active = {
                conversation: null,
                messages: [],
                nextTokenMessages: null,
            }
        },
        resetBadge() {
            this.newBadge = defaultState.newBadge;
        },
        async list() {
            const { appsyncClient } = useAppsync();
            const { loadingOn, loadingOff } = useUi();

            loadingOn();
            const resp = await appsyncClient.listConversations({
                limit: this.limit,
                nextToken: this.nextToken
            })

            const { conversations, nextToken } = resp; // TODO: add totalCount here and set it below, once backend supports it

            this.conversations = conversations;
            this.nextToken = nextToken;
            this.fetchedCount += conversations.length;

            loadingOff()
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