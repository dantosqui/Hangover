import express from "express";

const router = express.Router();

router.get( "/", (req,res) =>{

    const pageSize=req.query.pageSize;//recibe la orden
    const page= req.query.page;
    const allUsers = userService.getAllUsers(pageSize,page);
    return res.json(allUsers)//devuelve una respuesta
});


router.post("/login", (req,res)=>{
    const body = req.body;
    const camposValidos = ['name', 'password'];
    const camposRecibidos = Object.keys(body);
    if(camposValidos == camposRecibidos){
        return res.status(232).send({
            valido: "bien ahi"
        });
    }
    else{
        return res.status(400).send("Error en los campos");
    }
});

router.post("/register", (req,res)=>{
    const body = req.body;
    const camposValidos = ['firstName', 'lastName', 'userName', 'password'];
    const camposRecibidos = Object.keys(body);
    if(camposValidos == camposRecibidos){
        return res.status(232).send({
            valido: "bien ahi"
        });
    }
    else{
        return res.status(400).send("Error en los campos");
    }
})

router.put( "/", (req,res)=>{})
router.delete( "/:id", (req,res) =>{// el : indica el nombre de una variable
    const id=req.params.id;//saca el id
    console.log(id);
    return res.send("Ok!");
});

export default router;