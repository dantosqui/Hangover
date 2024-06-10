import express from "express";
import PostsController from './src/controllers/post-controller.js';
import UsersController from './src/controllers/user-controller.js';


const app = express(); //Init API REST
app.use(express.json());
const port = 3508;

app.use("/post", PostsController);
app.use("/user", UsersController);

app.listen(port, () => {
    console.log(`Server is runing on port ${port}`);
})