import  express from "express";
import PostService from "../services/post-service.js"
import { AuthMiddleware } from "../auth/authMiddleware.js";
import { Comment } from "../entities/comment.js";
import { CommentLikes } from "../entities/comment_likes.js";
import { Liked } from "../entities/liked.js";


const router = express.Router()
const postService = new PostService()

router.get("/:id", async (req, res) => {
    const idPost=req.params.id;
    const limitComments=req.query.limitComments
    const offsetComments=req.query.offsetComments
    const post = await postService.GetPostById(idPost);
    const comments = await postService.GetCommentsPost(idPost,limitComments,offsetComments);
    //const likedByUser = await postService.GetLikedByUser();

    if (post===null){
        return res.status(404).send();
    }
    else{
        return res.status(200).json([post, comments]);
    }

});

router.get("/:id/comments", async (req, res) => {
    const idPost=req.params.id;
    const limitComments = req.query.limit;
    const page = req.query.page-1;
    const comments = await postService.GetCommentsPost(idPost, limitComments, page);
    return res.status(200).json(comments);
});

router.get("/comments/:idComment/responses", async (req, res) =>{
    const idComment = req.params.idComment;
    const limitResponses = req.query.limit;
    const page = req.query.page-1;
    const responses = await postService.GetResponsesComment(idComment, limitResponses, page);
    return res.status(200).json(responses);
});

router.get("/",async (req, res) =>{
    const limit = req.query.limit;
    const page = req.query.page;
    const collection = await postService.GetAllPost(limit, page);
    if(collection === null){
        return res.status(404).send();
    }
    else{
        return res.status(200).json(collection);
    }
}); 

router.post("/:id/comment", AuthMiddleware, async (req,res)=> {
    const comment = new Comment(
        null,
        req.body.post_id, 
        req.body.content,
        0, 
        req.body.parent_id, 
        req.user
    );



    const inserted = await postService.InsertComment(comment);
    if(inserted){
        return res.status(201).send();
    }
    else{
        return res.status(400).send();
    }
});

router.post("/:idPost/:idComment", AuthMiddleware, async (req,res)=> {
    const like = new CommentLikes(
        null,
        req.params.idComment,
        req.user    
    );
    
    const inserted = await postService.InsertCommentLikes(like);
    if(inserted){
        return res.status(201).send();
    }
    else{
        return res.status(400).send();
    }
    
});

router.delete("/:idPost/:idComment", AuthMiddleware, async (req,res)=> {
    const like = new CommentLikes(
        null,
        req.params.idComment,
        req.user    
    );
    
    const deleted = await postService.DeleteCommentLikes(like);
    if(deleted){
        return res.status(204).send();
    }
    else{
        return res.status(400).send();
    }
    
});

router.post("/:id/like", AuthMiddleware, async (req,res)=> {
    const like = new Liked(
        null,
        req.params.id,
        req.user
    ); 

    const inserted = await postService.InsertLiked(like);
    if(inserted){
        return res.status(201).send();
    }
    else{
        return res.status(400).send();
    }
});

router.delete("/:id/like", AuthMiddleware, async (req,res)=> {
    const like = new Liked(
        null,
        req.params.id,
        req.user
    ); 

    const deleted = await postService.DeleteLiked(like);
    if(deleted){
        return res.status(204).send();
    }
    else{
        return res.status(400).send();
    }
});

//guardar post

export default router