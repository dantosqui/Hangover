import ChatRepository from '../../repositories/chat-repository.js';

class ChatService {
    constructor() {
        this.bd = new ChatRepository();
    }

    async checkChat(id1, id2) {
        const exists = await this.bd.checkChat(id1, id2);
        return exists;
    }

    async recoverChat(id1, id2) {
        const chat = await this.bd.recoverChat(id1, id2);
        return chat;
    }

    async createMessage(id1, id2, content) {
        const message = await this.bd.createMessage(id1, id2, content);
        return message;
    }
}

export default ChatService;
