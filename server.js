import express from "express";
import EventsController from './src/controllers/events-controller.js';
//import UsersController from './src/controllers/users-controller.js';

const app = express(); //Init API REST
app.use(express.json());
const port = 3508;

app.use("/event", EventsController);
//app.use("/user", UsersController);

app.listen(port, () => {
    console.log(`Server is runing on port ${port}`);
})