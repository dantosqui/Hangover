// src/services/chat-service.js
import ChatRepository from '../../repositories/chat-repository.js';

class ChatService {
    constructor() {
        this.bd = new ChatRepository();
    }

    async checkChat(id1, id2) {
        const exists = await this.bd.checkChat(id1, id2);
        return exists;
    }

    async loadMessages(id1, id2, page, limit) {
        const messages = await this.bd.loadMessages(id1, id2, page, limit);
        return messages;
    }

    async createMessage(id1, id2, content) {
        const message = await this.bd.createMessage(id1, id2, content);
        return message;
    }
}

export default ChatService;