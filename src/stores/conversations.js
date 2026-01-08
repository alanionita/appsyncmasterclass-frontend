import { defineStore } from 'pinia';
import { ulid } from 'ulid';
import { useTwitterMyProfile } from './twitterMyProfile';
import { useAppsync } from './appsync';
import { throwWithLabel } from '@/utils/error';
import { useUi } from './ui';
import { Conversation } from '@/utils/entities';

const defaultState = {
    conversations: [],
    nextToken: null,
    limit: 10,
    totalCount: 0,
    hasMore: true,
    fetchedCount: 0,
    activeConversation: null,
    activeOtherUserId: null
}

export const useConversations = defineStore('conversations', {
    state: () => Object.assign({}, defaultState),
    actions: {
        async reset() {
            this.conversations = [];
            this.nextToken = null;
            this.totalCount = 0;
            this.hasMore = true;
            this.fetchedCount = 0;
            this.activeConversation = null
            this.activeOtherUserId = null
        },
        resetConversation(conv) {
            const newConv = Conversation.resetNewMessages(conv)
            this.update(newConv)
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

            if (conversations) {
                const expandedConversations = Conversation.expandAll(conversations)

                this.conversations = expandedConversations;
                this.fetchedCount += conversations.length;
            }

            if (nextToken) {
                this.nextToken = nextToken;
            }

            loadingOff()
        },
        find(conversationID = null) {
            try {
                if (!conversationID) throw Error('Missing conversationId');

                const foundConversation = this.conversations.filter(conversation => conversation.id === conversationID);

                if (foundConversation.length === 0) throw Error('No conversation found')

                return foundConversation[0];
            } catch (err) {
                throwWithLabel(err, 'store/conversations.find()')
            }
        },
        update(newConv) {
            const existingConv = this.find(newConv.id);
            if (existingConv) {
                const newList = this.conversations.map((oldConv) => oldConv.id === existingConv.id ? newConv : oldConv)
                this.conversations = newList
            }
        },
        setActive(convId, otherUserId) {
            this.activeConversation = convId;
            this.activeOtherUserId = otherUserId
        }
    },
    getters: {
        size: state => state.conversations && state.conversations.length
    }
});