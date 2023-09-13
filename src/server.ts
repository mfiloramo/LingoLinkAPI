// MODULE IMPORTS
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptions } from 'cors';
import WebSocket from 'ws';

// ROUTE IMPORTS
import { translationRouter } from './routes/translationRouter';
import { usersRouter } from './routes/usersRouter';
import { participantsRouter } from './routes/participantsRouter';
import { messagesRouter } from './routes/messagesRouter';
import { conversationsRouter } from './routes/conversationsRouter';
import { validateAccessToken } from './middleware/validateAccessToken';

// GLOBAL VARIABLES
const server: Express = express();
const app: any = require('http').createServer(server);
const wss: any = new WebSocket.Server({ server: app });
const PORT = process.env.PORT || 3000;

// CORS OPTIONS
const corsOptions: CorsOptions = {
  origin: ['http://localhost:4200', 'https://orange-tree-0d3c88e0f.3.azurestaticapps.net'],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type',  'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
};

// MIDDLEWARE CONFIGURATION
server
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors(corsOptions));

// SERVER ROUTES -- ENABLE validateAccessToken MIDDLEWARE FOR ALL ROUTES
server
  .use('/api/translate', translationRouter)
  .use('/api/users', usersRouter)
  .use('/api/participants', participantsRouter)
  .use('/api/messages', messagesRouter)
  .use('/api/conversations', conversationsRouter);

// HANDLE PREFLIGHT REQUESTS
server.options('*', cors(corsOptions));

// WILDCARD ENDPOINT
server.use('*', (req, res) => {
  res.status(404).send('Resource not found');
});

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

  ws.on('close', () => {
    // INDICATE CLIENT DISCONNECTION
    console.log('Client disconnected...');
  });
});

// RUN EXPRESS SERVER
server.listen(PORT, () => {
  console.log(`Listening on port: ${ PORT }...`);
});