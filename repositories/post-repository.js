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
        let query = 
        `SELECT posts.*, 
        json_build_object (
            'id', users.id,
            'username', users.username,
            'profile_photo', users.profile_photo,
            'follower_number', (SELECT COUNT(id) FROM user_relationships WHERE followed_id = users.id)
        ) AS creatorUser
        json_build_object (
            'id', pp.id,
            'url', pp.url,
            'type', pp.type
        ) AS post_image
        FROM posts 
        INNER JOIN users on posts.creator_id = users.id
        INNER JOIN post_photos pp ON pp.post_id = posts.id
        WHERE id = $1"`;
        let value = id;
        const post = (await this.DBClient.query(query, value)).rows;
        
        query =     
        `SELECT
        json_build_object (
            'user_id', u.id,
            'username', u.username,
            'profile_photo', u.profile_photo,
            'date', c.date_posted,
            'content', c.content,
            'comment_id', c.id,
            'parent_id', c.parent_id,
            'likes', (SELECT COUNT(id) FROM comments_like WHERE comment_id = c.id)
        ) AS comment,
        COUNT(c.id) AS total_comments
        FROM comments c 
        INNER JOIN users u ON c.creator_id = u.id
        WHERE c.post_id = $1
        GROUP BY c.id`;
        value = id;
        const comments = (await this.DBClient.query(query, value)).rows;

        return [post, comments];

    }

    async getaAllPost(limit, offset){
        let query = "SELECT COUNT(id) FROM posts";
        const total = await this.DBClient.query(query);
        if(Pagination.VerifyTotal(limit, offset, total)){
            query = `
            SELECT
            json_build_object (
                json_build_object (
                    'id', u.id
                    'username', u.username,
                    'profile_photo', u.profile_photo
                ) AS creator_user,
                json_build_object (
                    'id', pp.id,
                    'image', pp.url
                ) AS post_image
            ) AS post
            FROM posts p
            INNER JOIN users u ON p.creator_id = u.id
            INNER JOIN post_photos pp ON pp.post_id = p.id WHERE pp.type = 'front'
            LIMIT $1 OFFSET $2
            `;
            const collection = await this.DBClient.query(query);
            return collection;
        }
        else{
            return null;
        }
    }

}