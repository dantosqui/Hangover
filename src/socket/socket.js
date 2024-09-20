// src/socket/socket.js
import { Server } from 'socket.io';
import chatController from '../controllers/chat-controller.js';
import { decryptToken } from '../auth/jwt.js';

const chatCtrl = new chatController();

export default function setupSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    if (token !== "") {
      const decoded = decryptToken(token);
      socket.user = decoded;
    } else {
      socket.user = undefined;
    }
    next();
  });

  io.on('connection', async (socket) => {
    socket.on('set users', async (data) => {
      let { users } = data;
      if (socket.user === undefined) {
        socket.emit('error', { message: 'Sesion finalizada' });
        socket.disconnect();
        return;
      }
      if (users[0] != socket.user.id) {
        socket.emit('error', { message: 'ID de usuario no válido' });
        socket.disconnect();
        return;
      }
      
      socket.users = users;
      await chatCtrl.checkChat(users);
      socket.emit('user connected', { userID: users[0] });
      
      socket.on('chat message', async (data) => {
        const mensaje = data.mensaje;

        try {
          const result = await chatCtrl.createMessage(users, mensaje);
          io.emit('chat message', result.rows[0].content, result.rows[0].id.toString(), result.rows[0].sender_user, result.rows[0].date_sent, users[0]);
        } catch (error) {
          console.error('Error al crear mensaje:', error);
        }
      });

      socket.on('load messages', async (data) => {
        console.log("Holaaa");
        const { page, limit } = data;
        try {
          const results = await chatCtrl.loadMessages(users, page, limit);
          socket.emit('load messages', results.rows, results.hasMore);
        } catch (error) {
          console.error('Error al cargar mensajes:', error);
          socket.emit('error', { message: 'Error al cargar mensajes' });
        }
      });
    });
  });

  return io;
}