import pg from 'pg';
import { DBConfig } from "./dbconfig.js";
import { createToken } from "../src/auth/jwt.js";


export class UserRepository {
    constructor() {
        const { Client } = pg;
        this.DBClient = new Client(DBConfig);
        this.DBClient.connect();
    }
    
    async getUser(username, password) {
        try {
            const query = "SELECT id FROM users WHERE username = $1 AND password = $2"; 
            const values = [username, password];
            const response = await this.DBClient.query(query, values);
            if(response.rowCount > 0){
                const token = createToken(response.rows);
                return [true, token, 200];
            }
            else{
                return [false, "", 404];
            }
        }
        catch(e){
            console.log(e);
            return [false, "", 500];
        }
    }

    async validateRegister(user){
        try {
            let query = "SELECT * FROM users WHERE username = $1";
            let value = [user.username];
            let response = await this.DBClient.query(query, value);
            if(response.rows.length == 0){
                query = "SELECT * FROM users WHERE email = $1";
                value = [user.email];
                response = await this.DBClient.query(query, value);
                if(response.rows.length === 0){
                    query = "INSERT INTO users (first_name, last_name, email, username, password, date_of_birth, role_id) VALUES ($1, $2, $3, $4, $5,$6,2)"; //id role 2 hardcodeado porque los admins los hacen los admins y los mods igual
                    const values = [user.first_name, user.last_name, user.email, user.username, user.password,user.date_of_birth];
                    response = await this.DBClient.query(query, values);
                    return [true, 201, ""]; 
                }
                return [false, 400, "El email ya está registrado a otra cuenta"];             
            }
            return [false, 400, "El nombre de usuarios ya existe"];
        }
        catch(e){
            console.log("error validadndo registro",e);
        }
    }

    async getUserById(id){
        try {
            const query = "SELECT * FROM users WHERE id = $1";
            
            const user = await this.DBClient.query(query,[id]);
            return user.rows;
        }
        catch(e){
            console.log(e);
        }
    }
    
    async getSavedLikedPosts(userId){//NO SE OBTIENE LA FOTO DE PERFIL!!!! DEL CREADOR
        try{
            const queryLiked="SELECT posts.id as postId, posts.creator_id, posts.front_image, users.* FROM posts INNER JOIN liked on liked.post_id=posts.id inner join users on liked.user_id=users.id where liked.user_id=$1"
            const querySaved="SELECT posts.id as postId, posts.creator_id, posts.front_image, users.* FROM posts INNER JOIN saved on saved.post_id=posts.id inner join users on saved.user_id=users.id where saved.user_id=$1"
            const queryBorradores="SELECT id, last_edit, id_creator_user, parent_id, image FROM designs WHERE id_creator_user = $1";
            const liked = await this.DBClient.query(queryLiked,[userId])
            const saved = await this.DBClient.query(querySaved,[userId])
            const borradores = await this.DBClient.query(queryBorradores, [userId]);
        

            const posts = {liked:liked.rows,saved:saved.rows, borradores:borradores.rows}
          
            return posts
        }
        catch(e) {
            console.error(e)
        }
    }

    async getTotalUserInfo(ownId, userId){
        try{
            const query = 
            `
            SELECT 
            json_build_object(
                'id', users.id,
                'username', users.username,
                'first_name', users.first_name,
                'last_name', users.last_name,
                'profile_photo', users.profile_photo,
                'description', users.description,
                'post_number', (
                    SELECT COUNT(posts.id) 
                    FROM posts
                    INNER JOIN visibilities ON visibilities.id = posts.visibility_id
                    WHERE posts.creator_id = users.id
                    AND visibilities.visibility = 'public'
                ),
                'follower_number', (
                    SELECT COUNT(id) 
                    FROM user_relationships 
                    WHERE followed_id = users.id
                ),
                'followed_number', (
                    SELECT COUNT(id) 
                    FROM user_relationships 
                    WHERE follower_id = users.id
                )
            ) AS user_data,
            (
                SELECT json_agg(
                    json_build_object(
                        'id', posts.id,
                        'title', posts.title,
                        'image',posts.front_image,
                        'saved', (
                            SELECT EXISTS(
                                SELECT 1 
                                FROM saved 
                                WHERE post_id = posts.id 
                                AND user_id = $1
                            )
                        )
                    )
                )
                FROM posts
                INNER JOIN visibilities ON visibilities.id = posts.visibility_id
                WHERE posts.creator_id = users.id
                AND visibilities.visibility = 'public'
            ) AS posts,
            (
                SELECT EXISTS(
                    SELECT 1 
                    FROM user_relationships 
                    WHERE follower_id = $1 
                    AND followed_id = users.id
                )
            ) AS follows
            FROM users
            WHERE users.id = $2;
            `;
            const values = [ownId === null ? null : ownId.id, parseInt(userId)];
            const info = await this.DBClient.query(query, values);
            return info.rows[0];
        }
        catch(e){
            console.error(e);
        }
    }

    async insertFollow(ownId,followId){ // this no checkea si el usuario ya lo sigue o no asi q ojo
        const query = " inserT INTO user_relationships (follower_id, followed_id) values ($1,$2)"
        const values = [ownId,followId]
        try{
            const inserted = await this.DBClient.query(query,values)
            return inserted.rowCount>0
        }
        catch (error){
            console.error("Error capturado: ",error)
        }
    }
    async deleteFollow(ownId,followId){
        const query = "delete from user_relationships where follower_id=$1 and followed_id=$2"
        const values=[ownId,followId]
        try{
            const inserted = await this.DBClient.query(query,values)
            return inserted.rowcount>0
        }
        catch (error){
            console.error("error capturado: ",error)
        }
    }
    async getFriends(idUser) {
        const query = `
            SELECT u.id, u.username
            FROM users u
            WHERE u.id IN (
                SELECT followed_id
                FROM user_relationships
                WHERE follower_id = $1
                AND followed_id IN (
                    SELECT follower_id
                    FROM user_relationships
                    WHERE followed_id = $1
                )
            );
        `;
        const values = [idUser]
        const result = await this.DBClient.query(query, values)
        return result.rows
    }
    
    async getCarrito(id){
        const query = `
                SELECT 
                    shopping_cart.id AS cart_id,
                    shopping_cart.user_id,
                    shopping_cart.post_id,
                    shopping_cart.quantity,
                    posts.title,
                    posts.description,
                    posts.price,
                    posts.front_image,
                    posts.back_image
                FROM 
                    shopping_cart
                INNER JOIN 
                    posts ON shopping_cart.post_id = posts.id
                WHERE 
                    shopping_cart.user_id = $1;
            `;
        const values = [id];
        try{
            const carrito = await this.DBClient.query(query, values);
            return {carritoStuff:carrito.rows}
        }
        catch(error){
            console.error("error capturado: ",error);
        }
    }

}