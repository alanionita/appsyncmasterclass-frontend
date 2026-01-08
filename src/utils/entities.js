import { ulid } from "ulid"

export const conversationExpansionFields = {
    hasNewMessages: false,
    isNew: false
}

export const Conversation = {
    generateId: (aId, bId) => {
        const conversationId = aId < bId
            ? `${aId}_${bId}`
            : `${bId}_${aId}`
        return conversationId
    },
    buildFrom({ id, notification }) {
        const newConversation = {
            id,
            lastMessage: notification.message,
            lastModified: notification.createdAt,
            otherUser: Object.assign({}, notification.profile),
            hasNewMessages: false
        }
        return newConversation
    },
    expandAll(conversations) {
        const expandFields = {
            hasNewMessages: false,
            isNew: false
        }
        try {
            if (!conversations || conversations.length < 1) throw Error('Invalid input');

            const alreadyExpanded = Object.keys(expandFields).every((key) => conversations[key] ? true : false)

            if (alreadyExpanded) return;

            return conversations.map(conv => {
                return Object.assign({}, conv, expandFields)
            })
        } catch (err) {
            throwWithLabel(err, 'utils/entities/Conversation.expand()')

        }
    },
    resetNewMessages(conversation) {
        return Object.assign({}, conversation, { hasNewMessages: false })
    }
}

export const Message = {
    buildFromNotification: (notification) => {
        const newMessage = {
            from: Object.assign({}, notification.profile),
            message: notification.message,
            messageId: ulid(),
            timestamp: notification.createdAt,
        }
        return newMessage
    }
}