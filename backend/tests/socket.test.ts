import { io as Client } from 'socket.io-client';
import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

describe('Socket.io Messaging Flow', () => {
  let ioServer: Server;
  let httpServer: http.Server;
  let port: number;
  let user1Cookie: string;
  let user2Cookie: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/borrowbox_socket_test');
    
    httpServer = http.createServer(app);
    ioServer = new Server(httpServer);
    
    ioServer.use((socket, next) => {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');
      const token = cookies.jwt;
      if (!token) return next(new Error('Authentication error'));
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
        (socket as any).userId = decoded.userId;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    ioServer.on('connection', (socket) => {
      socket.on('join_conversation', (id) => socket.join(id));
      socket.on('send_message', (data) => ioServer.to(data.conversationId).emit('receive_message', data));
    });

    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        port = (httpServer.address() as any).port;
        resolve();
      });
    });

    // Register users to get cookies
    const res1 = await request(app).post('/api/auth/register').send({
      name: 'User 1', email: 's1@ex.com', password: 'password', location: { coordinates: [0, 0] }
    });
    user1Cookie = res1.headers['set-cookie'][0];

    const res2 = await request(app).post('/api/auth/register').send({
      name: 'User 2', email: 's2@ex.com', password: 'password', location: { coordinates: [0, 0] }
    });
    user2Cookie = res2.headers['set-cookie'][0];
  });

  afterAll(async () => {
    ioServer.close();
    httpServer.close();
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.connection.close();
  });

  it('should authenticate and exchange messages', (done) => {
    const client1 = Client(`http://localhost:${port}`, {
      extraHeaders: { cookie: user1Cookie }
    });

    client1.on('connect', () => {
      const client2 = Client(`http://localhost:${port}`, {
        extraHeaders: { cookie: user2Cookie }
      });

      client2.on('connect', () => {
        const convId = 'test-conv';
        client1.emit('join_conversation', convId);
        client2.emit('join_conversation', convId);

        client2.on('receive_message', (data: any) => {
          expect(data.content).toBe('Hello from User 1');
          client1.close();
          client2.close();
          done();
        });

        setTimeout(() => {
          client1.emit('send_message', { conversationId: convId, content: 'Hello from User 1' });
        }, 100);
      });
    });
  });
});
