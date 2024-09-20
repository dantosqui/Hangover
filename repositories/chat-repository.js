// src/repositories/chat-repository.js
import pg from 'pg';
import { DBConfig } from './dbconfig.js';

class ChatRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getChatId(id1, id2) {
        const query = `
            SELECT chat_id
            FROM chat_members
            WHERE user_id IN ($1, $2)
            GROUP BY chat_id
            HAVING COUNT(DISTINCT user_id) = 2
               AND COUNT(*) = (
                   SELECT COUNT(*)
                   FROM chat_members cm2
                   WHERE cm2.chat_id = chat_members.chat_id
               );
        `;

        const result = await this.DBClient.query(query, [id1, id2]);
        if (result.rows.length > 0) {
            return result.rows[0].chat_id;
        } else {
            return null;
        }
    }

    async checkChat(id1, id2) {
        let result = await this.getChatId(id1, id2);
        if (result === null) {
            let query = "INSERT INTO chats (name) VALUES (null) RETURNING id";
            result = await this.DBClient.query(query);
            const newChatId = result.rows[0].id;

            if (newChatId) {
                query = "INSERT INTO chat_members (chat_id, user_id) VALUES ($1, $2), ($1, $3)";
                result = await this.DBClient.query(query, [newChatId, id1, id2]);
                if (result.rowCount !== 2) {
                    throw new Error('Failed to insert chat members');
                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
    }

    async loadMessages(id1, id2, page, limit) {
        let chatId = await this.getChatId(id1, id2);
        if (chatId !== null) {
            const offset = (page - 1) * limit;
            const query = `
                SELECT * FROM messages 
                WHERE chat_id = $1 AND date_sent < CURRENT_TIMESTAMP
                ORDER BY date_sent DESC
                LIMIT $2 OFFSET $3
            `;
            const countQuery = `
                SELECT COUNT(*) FROM messages 
                WHERE chat_id = $1 AND date_sent < CURRENT_TIMESTAMP
            `;
            
            const messages = await this.DBClient.query(query, [chatId, limit, offset]);
            const countResult = await this.DBClient.query(countQuery, [chatId]);
            const totalCount = parseInt(countResult.rows[0].count);
            
            return {
                rows: messages.rows.reverse(),
                hasMore: totalCount > (page * limit)
            };
        } else {
            throw new Error('Chat not found');
        }
    }

    async createMessage(id1, id2, content) {
        const query = "INSERT INTO messages (content, date_sent, sender_user, chat_id) VALUES ($1, CURRENT_TIMESTAMP, $2, $3) RETURNING id, content, date_sent, sender_user";
        const result = await this.getChatId(id1, id2);
        if (result !== null) {
            const creation = await this.DBClient.query(query, [content, id1, result]);
            if (creation.rowCount === 0) {
                throw new Error('Failed to create message');
            } else {
                return creation;
            }
        } else {
            throw new Error('Chat not found');
        }
    }
}

export default ChatRepository;