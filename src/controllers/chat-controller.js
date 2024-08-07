import ChatService from '../services/chat-service.js';

class chatController {
    constructor() {
        this.chatService = new ChatService();
    }

    async checkChat(users) {
        const exists = await this.chatService.checkChat(users[0], users[1]);
        console.log("holaaaaaaaax2");   
    };

    async recoverChat(users) {
        const messages = await this.chatService.recoverChat(users[0], users[1]);
        return messages;
    }

    async createMessage(users, content) {
        const creation = await this.chatService.createMessage(users[0], users[1], content);
        return creation;
    }

}

export default chatController;