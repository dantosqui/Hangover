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

app.get('/privateChat/:id1/:id2', AuthMiddleware, async (req, res) => {
  console.log("Holaaa");
  const id1 = req.params.id1;
  const id2 = req.params.id2;
  if (id1 != req.user.id) {
    return res.status(401).send();
  }
  const users = [id1, id2];
  console.log("hola12");
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (error) {
    console.error('Error al verificar el chat:', error);
    res.status(500).send('Error al verificar el chat');
  }
});

// Configura y usa el servidor de socket.io
const io = setupSocketServer(server);

const port = 3508;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
