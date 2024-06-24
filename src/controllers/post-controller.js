import  express from "express";
import  Pagination  from "../entities/pagination.js";
import PostService from "../services/post-service.js"
import { AuthMiddleware } from "../auth/authMiddleware.js";


const router = express.Router()
const postService = new PostService()

const limitComments = 10

router.get("/:id", async (req, res) => {
    const idPost=req.params.id;
    const post = await postService.GetPostById(idPost);
    const comments = await postService.GetCommentsPost(idPost);

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

/*router.post("/:id/comments",AuthMiddleware,async (req,res)=> {
    const comment = new 
})*/

export default router