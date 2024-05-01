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

// PORTS ARRAY
const ports: number[] = [ 3000 ];

// START SERVER (OPTION OF TESTING MULTLIPLE PORTS)
function createServer(PORT: number): void {
  const app: Express = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

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
    .use('/api/auth', authRouter);

  // HANDLE PREFLIGHT REQUESTS
  app.options('*', cors(corsOptions));

  // WILDCARD ENDPOINT FOR UNHANDLED ROUTES
  app.use('*', (req, res) => res.status(404).send('Resource not found'));

  // WEB SOCKET SERVER
  wss.on('connection', (ws: WebSocket): void => {
    console.log(`Client connected on port ${ PORT }...`);

    ws.on('message', message => {
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', (): void => {
      console.log('Client disconnected...');
    });
  });

  // LISTEN FOR INCOMING CONNECTIONS
  server.listen(PORT, (): void => {
    console.log(`Server listening on port: ${ PORT }...`);
  });
}

// INITIATE SERVER ON EACH SPECIFIED PORT
ports.forEach(createServer);
