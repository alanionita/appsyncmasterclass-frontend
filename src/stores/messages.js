import { defineStore } from 'pinia';
import { ulid } from 'ulid';
import { useTwitterMyProfile } from './twitterMyProfile';
import { useAppsync } from './appsync';
import { throwWithLabel } from '@/utils/error';
import { useUi } from './ui';
import { useConversations } from './conversations';

const defaultState = {
    messages: [],
    nextToken: null,
    limit: 10,
    totalCount: 0,
    hasMore: true,
    fetchedCount: 0,
    newMessage: '',
}

export const useMessages = defineStore('messages', {
    state: () => Object.assign({}, defaultState),
    actions: {
        async reset() {
            this.messages = []
            this.nextToken = null
            this.totalCount = 0
            this.hasMore = true
            this.fetchedCount = 0
            this.newMessage = ''
        },
        async list(conversation) {
            const { appsyncClient } = useAppsync();
            const { toggleLoadingMessages, resetNewMessageBadge } = useUi();
            const { resetConversation } = useConversations();
            try {
                toggleLoadingMessages();
                if (!conversation) throw Error('Missing inputs');

                const { messages, nextToken } = await appsyncClient.getDirectMessages({
                    otherUserId: conversation.otherUser.id,
                    limit: this.limit,
                    nextToken: this.nextToken
                })

                if (!messages) throw Error('Error in retrieving messages')

                if (messages && messages.length > 0) {
                    this.messages = messages
                    this.fetchedCount = messages.length;
                    resetNewMessageBadge()
                    resetConversation(conversation)
                    toggleLoadingMessages();
                }
                if (nextToken) {
                    this.nextToken = nextToken
                }
            } catch (err) {
                throwWithLabel(err, 'messagesStore.list()')
            }
        },
        async send(to) {
            const { appsyncClient } = useAppsync();
            const { id } = useTwitterMyProfile();
            try {
                if (!this.newMessage || this.newMessage.length === 0 || !to) throw Error('Invalid inputs')

                const res = await appsyncClient.sendDirectMessage({
                    otherUserId: to,
                    message: this.newMessage
                })

                if (res.lastMessage === this.newMessage) {
                    const newMessage = {
                        message: res.lastMessage,
                        timestamp: res.lastModified,
                        messageId: ulid(),
                        from: {
                            id
                        }
                    }

                    this.messages = [newMessage, ...this.messages];
                    this.newMessage = ''
                }
            } catch (err) {
                throwWithLabel(err, 'messagesStore.send()')
            }
        },
        add(message) {
            this.messages = [message, ...this.messages]
        }
    },
    getters: {
        size: state => state.messages.length
    }
});