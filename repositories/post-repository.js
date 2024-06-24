import pg from 'pg';
import { DBConfig } from "./dbconfig.js";
import  Pagination  from '../src/entities/pagination.js';

export class PostRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }

    async getPostById(id){
        const query = 
        `SELECT posts.*, 
        json_build_object (
            'id', users.id,
            'username', users.username,
            'profile_photo', users.profile_photo,
            'follower_number', (SELECT COUNT(id) FROM user_relationships WHERE followed_id = users.id)
        ) AS creatorUser,
        json_build_object (
            'front_image', posts.front_image,
            'back_image', posts.back_image
        ) AS post_image,
        (SELECT COUNT(id) FROM comments WHERE post_id = posts.id) AS total_comments
        FROM posts 
        INNER JOIN users on posts.creator_id = users.id
        WHERE posts.id = $1`;
        const post = (await this.DBClient.query(query, [id])).rows;
        return post;
    }

    async getCommentsPost(id, limit_comments_post, page_comments_post){
        let query = 
        `SELECT
        json_build_object (
            'user_id', u.id,
            'username', u.username,
            'profile_photo', u.profile_photo,
            'date', c.date_posted,
            'content', c.content,
            'comment_id', c.id,
            'parent_id', c.parent_id,
            'likes', (SELECT COUNT(id) FROM comment_likes WHERE comment_id = c.id)
        ) AS comment,
        (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) AS total_responses_comment,
        FROM comments c
        INNER JOIN users u ON c.creator_id = u.id
        WHERE c.post_id = $1 AND c.parent_id IS NULL
        GROUP BY c.id, u.id
        LIMIT $2 OFFSET $3;
        `;
        const comments = (await this.DBClient.query(query, [id, limit_comments_post, page_comments_post * limit_comments_post])).rows;

        query = "SELECT COUNT(id) AS total FROM comments WHERE post_id = $1";
        const total_comments_post = (await this.DBClient.query(query, [id])).rows[0].total;

        return Pagination.BuildPagination(comments, limit, page, total_comments_post);
    }

    async getResponsesComment(idComment, limit_responses_comment, page_responses_comment){
        let query = 
        `SELECT
        json_build_object (
            'user_id', u.id,
            'username', u.username,
            'profile_photo', u.profile_photo,
            'date', c.date_posted,
            'content', c.content,
            'comment_id', c.id,
            'parent_id', c.parent_id,
            'likes', (SELECT COUNT(id) FROM comment_likes WHERE comment_id = c.id)
        ) AS comment
        FROM comments c
        INNER JOIN users u ON c.creator_id = u.id
        WHERE c.parent_id = $1
        LIMIT $2 OFFSET $3`;

        const responses = (await this.DBClient.query(query, [idComment, limit_responses_comment, page_responses_comment * limit_responses_comment])).rows;

        query = "SELECT COUNT(id) AS total FROM comments WHERE parent_id = $1";
        const total_responses_comment = (await this.DBClient.query(query, [id])).rows[0].total;

        return Pagination.BuildPagination(responses, limit, page, total_responses_comment);

    }

    async getAllPost(limit, page){
        let query = `
            SELECT
            json_build_object (
                'creator_user', json_build_object (
                    'id', u.id,
                    'username', u.username,
                    'profile_photo', u.profile_photo
                ),
                'front_image', p.front_image
            ) AS post
            FROM 
                posts p
            INNER JOIN 
                users u ON p.creator_id = u.id
            LIMIT $1 OFFSET $2;
            `;
        const collection = (await this.DBClient.query(query, [limit, page*limit])).rows;

        query = "SELECT COUNT(id) AS total FROM posts";
        const total = (await this.DBClient.query(query)).rows[0].total;

        return Pagination.BuildPagination(collection, limit, page, total);
        
    }

    async insertComment(comment){
        const query = "INSERT INTO comments (post_id, content, date_posted, likes, parent_id, creator_id) VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5)";
        const values = [comment.post_id, comment.content, comment.likes, comment.parent_id, comment.creator_id];                
        try{
            const inserted = await this.DBClient.query(query, values);
            return inserted.rowCount > 0;
        } catch (error) {
            console.log('Error al insertar comentario:', error);
        }
        
    }


}