import  express from "express";
import  Pagination  from "../entities/pagination.js";
import PostService from "../services/post-service.js"



const router = express.Router()
const postService = new PostService()


router.get("/:id", async (req, res) => {
    const idPost=req.params.id
    const [post, comments] = postService.GetPostById(idPost)

    if (post===null){
        return res.status(404).send();
    }
    else{
        const limit = Pagination.SetLimit(0);
        const collection = postService.GetAllPost(limit, offset);
        return res.status(200).json([post, comments], collection);
    }

});

router.get("/",async (req, res) =>{
    const limit = Pagination.SetLimit(1);
    const offset = req.query.offset;
    const collection = postService.GetAllPost(limit, offset);
    if(collection === null){
        return res.status(404).send();
    }
    else{
        return res.status(200).json(collection);
    }
});

export default router