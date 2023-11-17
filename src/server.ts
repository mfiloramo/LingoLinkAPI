// MODULE IMPORTS
import express, { Express } from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors, { CorsOptions } from 'cors';

// ROUTE IMPORTS
import { translationRouter } from './routers/translation.router';
import { usersRouter } from './routers/users.router';
import { participantsRouter } from './routers/participants.router';
import { messagesRouter } from './routers/messages.router';
import { conversationsRouter } from './routers/conversations.router';
import { authRouter } from "./routers/auth.router";

// GLOBAL VARIABLES
const app: Express = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
const server: any = http.createServer(app);

// CORS MIDDLEWARE
const corsOptions: CorsOptions = {
  origin: [ 'http://localhost:4200', 'https://orange-tree-0d3c88e0f.3.azurestaticapps.net' ],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: [ 'GET', 'POST', 'PUT', 'DELETE' ],
  allowedHeaders: [ 'Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept' ],
};
app.use(express.json());
app.use(cors(corsOptions));

// SERVER ROUTES
app
  .use('/api/translate', translationRouter)
  .use('/api/users', usersRouter)
  .use('/api/participants', participantsRouter)
  .use('/api/messages', messagesRouter)
  .use('/api/conversations', conversationsRouter)
  .use('/api/auth', authRouter)

// HANDLE PREFLIGHT REQUESTS
app.options('*', cors(corsOptions));

// TODO: MAKE WILDCARD VIEW
// WILDCARD ENDPOINT
app.use('*', (req: any, res: any): void => {
  res.status(404).send('Resource not found');
});

// INITIATE WEBSOCKET SERVER ON TOP OF THE HTTP SERVER
const wss: any = new WebSocket.Server({ server });

// WEBSOCKET SERVER
wss.on('connection', (ws: WebSocket): void => {
  // INDICATE CLIENT CONNECTION
  console.log('Client connected...');

  // BROADCAST WEBSOCKET DATA TO CLIENTS
  ws.on('message', (message: WebSocket.Data): void => {
    wss.clients.forEach((client: WebSocket.WebSocket): void => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', (): void => {
    // INDICATE CLIENT DISCONNECTION
    console.log('Client disconnected...');
  });
});

// RUN SERVER FOR API AND WEBSOCKETS
server.listen(PORT, (): void => {
  console.log(`Server listening on port: ${ PORT }...`);
});
