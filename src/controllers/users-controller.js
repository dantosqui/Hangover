/*import express from "express";

const router = express.Router();

router.get( "/", (request,response) =>{

    const pageSize=req.query.pageSize;//recibe la orden
    const page= req.query.page;
    const allUsers = userService.getAllUsers(pageSize,page);
    return response.json(allUsers)//devuelve una respuesta
});


router.post( "/user/login", (req,res)=>{
    const body = req.body;
    console.log(body);
    return res.status(232).send({
        userName: body.name,
        password: body.password,
    }) 
})

router.post( "/user/register", (req,res)=>{
    const body = req.body;
    console.log(body);
    return res.status(232).send({
        firstName: body.firstName,
        lastName: body.lastName,
        userName: body.userName,
        password: body.password,
    }) 
})

router.put( "/", (req,res)=>{})
router.delete( "/:id", (req,res) =>{// el : indica el nombre de una variable
    const id=req.params.id;//saca el id
    console.log(id);
    return res.send("Ok!");
});

export default router;*/