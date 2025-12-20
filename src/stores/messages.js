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
        findConversation(conversationID = null) {
            try {
                if (!conversationID) throw Error('Missing conversationId');

                const foundConversation = this.conversations.filter(conversation => conversation.id === conversationID);

                if (foundConversation.length === 0) throw Error('No conversation found')

                return foundConversation[0];
            } catch (err) {
                throwWithLabel(err, 'messagesStore.findConversation()')
            }
        },
        setActiveConversation(conversationID = null){
            try {
                if (!conversationID) throw Error('Missing conversationId');

                const foundConversation = this.findConversation(conversationID)

                if (!foundConversation) throw Error('Conversation not found')

                this.active.conversation = JSON.parse(JSON.stringify(foundConversation))
            } catch (err) {
                throwWithLabel(err, 'messagesStore.setActiveConversation()')
            }
        }
    },
    getters: {
        activeConversation: state => state.active && state.active.conversation && state.active.conversation.id,
        conversationsAmount: state => state.conversations && state.conversations.length
    }
});