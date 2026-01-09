import { defineStore } from 'pinia';
import { useTwitterMyProfile } from './twitterMyProfile';
import { useAppsync } from './appsync';
import { throwWithLabel } from '@/utils/error';
import { useUi } from './ui';
import { Conversation } from '@/utils/entities';
import { useMessages } from './messages';

const defaultState = {
    conversations: [],
    nextToken: null,
    limit: 10,
    totalCount: 0,
    hasMore: true,
    fetchedCount: 0,
    activeConversationId: null,
    activeOtherUserId: null,
    activeOtherUserScreenName: null,
    activeConversationIsNew: false,
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
            this.activeConversationId = null
            this.activeOtherUserId = null
            this.activeOtherUserScreenName = null
            this.activeConversationIsNew = false
        },
        resetConversation(conv) {
            const newConv = Conversation.resetNewMessages(conv)
            this.update(newConv)
        },
        toggleActiveConversationIsNew() {
            this.activeConversationIsNew = !this.activeConversationIsNew
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
        setActive(conversation) {
            const { id, otherUser, isNew } = conversation;
            this.activeConversationId = id;
            this.activeOtherUserId = otherUser.id;
            this.activeOtherUserScreenName = otherUser.screenName;
            this.activeConversationIsNew = isNew
        },
        new(otherUser) {
            const storeMyProfile = useTwitterMyProfile();
            const newConvId = Conversation.generateId(storeMyProfile.id, otherUser.id)

            const convExits = this.find(newConvId)

            if (convExits) {
                const storeMessages = useMessages();
                this.setActive(convExits)

                storeMessages.list(convExits)
                return;
            }

            const newConversation = {
                id: newConvId,
                lastMessage: null,
                lastModified: Date.now(),
                otherUser: { ...otherUser },
                hasNewMessages: false,
                isNew: true
            };

            this.conversations = [newConversation, ...this.conversations];

            this.setActive(newConversation);
        }
    },
    getters: {
        size: state => state.conversations && state.conversations.length
    }
});