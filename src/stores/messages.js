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
    newBadge: 0,
    conversationsSet: new Set(),
    active: {
        conversation: null,
        messages: [],
        nextTokenMessages: null,
        otherUserId: null
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
                otherUserId: null
            }
        },
        resetBadge() {
            this.newBadge = defaultState.newBadge;
            this.active.conversation.hasNewMessages = false;
        },
        resetConversation(conv) {
            const resetConversation = Conversation.resetNewMessages(conv)
            this.updateConversation(resetConversation)
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

            const expandedConversations = Conversation.expandAll(conversations)

            this.conversations = expandedConversations;
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
        async activateConversation(conversationID = null) {
            const { appsyncClient } = useAppsync();
            const { id } = useTwitterMyProfile();
            const { toggleLoadingMessages } = useUi();
            try {
                toggleLoadingMessages();
                if (!conversationID) throw Error('Missing conversationId');

                const foundConversation = this.findConversation(conversationID)

                if (!foundConversation) throw Error('Conversation not found')

                const [partA, partB] = conversationID.split('_');

                this.active.otherUserId = partA !== id ? partA : partB;
                this.active.conversation = foundConversation

                const messages = await appsyncClient.getDirectMessages({
                    otherUserId: this.active.otherUserId,
                    limit: 10,
                    nextToken: null
                })

                if (!messages) throw Error('Error in retrieving messages')

                if (messages && messages.messages && messages.messages.length > 0) {
                    this.active.messages = messages.messages
                    this.resetBadge()
                    this.resetConversation(foundConversation)
                    toggleLoadingMessages();
                }
            } catch (err) {
                throwWithLabel(err, 'messagesStore.activateConversation()')
            }
        },
        async sendMessage({ message, to }) {
            const { appsyncClient } = useAppsync();
            const { id } = useTwitterMyProfile();
            try {
                if (!message || message.length < 1 || !to) throw Error('Invalid inputs')

                const res = await appsyncClient.sendDirectMessage({
                    otherUserId: to,
                    message
                })

                if (res.lastMessage === message) {
                    const newMessage = {
                        message: res.lastMessage,
                        timestamp: res.lastModified,
                        messageId: ulid(),
                        from: {
                            id
                        }
                    }

                    this.active.messages = [newMessage, ...this.active.messages]
                }


            } catch (err) {
                throwWithLabel(err, 'messagesStore.sendMessage()')
            }
        },
        addActiveMessage(message) {
            this.active.messages = [message, ...this.active.messages]
        },
        updateConversation(newConv) {
            const existingConv = this.findConversation(newConv.id);
            if (existingConv) {
                const newList = this.conversations.map((oldConv) => {
                    if (oldConv.id === existingConv.id) {
                        return newConv;
                    }
                    return oldConv;
                });
                this.conversations = newList
            }
        }
    },
    getters: {
        activeConversation: state => state.active && state.active.conversation && state.active.conversation.id,
        activeOtherUserId: state => state.active && state.active.otherUserId,
        activeMessages: state => state.active && state.active.messages,
        conversationsAmount: state => state.conversations && state.conversations.length
    }
});