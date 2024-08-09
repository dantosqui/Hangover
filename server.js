import express from 'express';
import cors from 'cors';
import PostsController from './src/controllers/post-controller.js';
import UsersController from './src/controllers/user-controller.js';
import http from 'http';
import path from 'path';
import url from 'url';
import { Server } from 'socket.io';
import chatController from './src/controllers/chat-controller.js';

// Obtener la ruta del directorio actual
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',  // Ajusta el origen según tu configuración
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: 'http://localhost:3000'
})); // Configura CORS
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));
const port = 3508;

// Configura las rutas para la API REST
app.use("/post", PostsController);
app.use("/user", UsersController);

const chatCtrl = new chatController();

// Usa el directorio actual para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/privateChat/:id1/:id2', async (req, res) => {
  const id1 = req.params.id1;
  const id2 = req.params.id2;
  users = [id1, id2];
  console.log("hola12");
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (error) {
    console.error('Error al verificar el chat:', error);
    res.status(500).send('Error al verificar el chat');
  }
});

io.on('connection', async (socket) => {

    if (true) {
      
      socket.on('set users', async (data) => {
      let { users } = data;
      console.log(typeof users[0]);
      socket.users = users; // Almacenar los usuarios en el socket
      await chatCtrl.checkChat(users);
      // Enviar el socket.userID al cliente recién conectado
      socket.emit('user connected', { userID: users[0] })
      socket.on('chat message', async (data) => {
        const mensaje = data.mensaje;

        try {
          const result = await chatCtrl.createMessage(users, mensaje); // Verifica que result.rows contenga los datos esperados

          // Emitir los campos individualmente
          io.emit('chat message', result.rows[0].content, result.rows[0].id.toString(), result.rows[0].sender_user, result.rows[0].date_sent, users[0]);
        } catch (error) {
          console.error('Error al crear mensaje:', error);
        }
      });

      if (!socket.recovered) {
        try {
          const results = await chatCtrl.recoverChat(users);

          results.rows.forEach(row => {
            // Emitir los campos individualmente al cliente
            socket.emit('chat message', row.content, row.id.toString(), row.sender_user, row.date_sent, users[0]);
          });
        } catch (e) {
          console.error(e);
        }
      }
    });
    }
  });
  
// Usa el servidor principal para las rutas REST
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

