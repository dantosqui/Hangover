// server.js
import express from 'express';
import cors from 'cors';
import PostsController from './src/controllers/post-controller.js';
import UsersController from './src/controllers/user-controller.js';
import DesignController from './src/controllers/design-controller.js';
import ImageController from './src/controllers/image-controller.js';
import http from 'http';
import path from 'path';
import url from 'url';
import { AuthMiddleware } from './src/auth/authMiddleware.js';
import setupSocketServer from './src/socket/socket.js'; // Importa la configuración de socket.io

// Obtener la ruta del directorio actual
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Configura las rutas para la API REST
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/post", PostsController);
app.use("/user", UsersController);
app.use("/design", DesignController);
app.use("/image", ImageController);

const io = setupSocketServer(server);

const port = 3508;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
