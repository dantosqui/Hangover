import express from "express";
import cors from 'cors';
import PostsController from './src/controllers/post-controller.js';
import UsersController from './src/controllers/user-controller.js';
import DesignController from "./src/controllers/design-controller.js";
import ImageController from './src/controllers/image-controller.js';

const app = express();
app.use(cors()); //Init API REST
app.use(express.json());  
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));  
const port = 3508;

app.use("/post", PostsController);
app.use("/user", UsersController);
app.use("/design", DesignController);
app.use("/image", ImageController);

app.listen(port, () => {
    console.log(`Server is runing on port ${port}`);
})