// src/controllers/chat-controller.js
import ChatService from '../services/chat-service.js';

class chatController {
    constructor() {
        this.chatService = new ChatService();
    }

    async checkChat(users) {
        const exists = await this.chatService.checkChat(users[0], users[1]);
    }

    async loadMessages(users, page, limit) {
        const messages = await this.chatService.loadMessages(users[0], users[1], page, limit);
        return messages;
    }

    async createMessage(users, content) {
        const creation = await this.chatService.createMessage(users[0], users[1], content);
        return creation;
    }
}

export default chatController;