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
        ) AS creatorUser,
        json_build_object (
            'front_image', posts.front_image,
            'back_image', posts.back_image
        ) AS post_image
        FROM posts 
        INNER JOIN users on posts.creator_id = users.id
        WHERE posts.id = $1`;
        let value = id;
        const post = (await this.DBClient.query(query, value)).rows;
        console.log("holla");
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
            'likes', (SELECT COUNT(id) FROM comment_likes WHERE comment_id = c.id)
        ) AS comment,
        COUNT(c.id) AS total_comments
        FROM comments c 
        INNER JOIN users u ON c.creator_id = u.id
        WHERE c.post_id = $1
        GROUP BY c.id, u.id`;
        value = id;
        const comments = (await this.DBClient.query(query, value)).rows;

        return [post, comments];

    }

    async getAllPost(limit, offset){
        let query = "SELECT COUNT(id) AS total FROM posts";
        const total = await this.DBClient.query(query);
        const moreContent = Pagination.VerifyTotal(limit, offset, total.rows[0].total);
        if(moreContent){
            query = `
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
            const values = [limit, offset];
            const collection = await this.DBClient.query(query, values);
            return collection.rows;
        }
        else{
            console.log(total.rows[0].total);
            return null;
        }
    }

}