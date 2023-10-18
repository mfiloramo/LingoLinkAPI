// MODULE IMPORTS
import express, { Express } from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors, { CorsOptions } from 'cors';

// ROUTE IMPORTS
import { translationRouter } from './routes/translationRouter';
import { usersRouter } from './routes/usersRouter';
import { participantsRouter } from './routes/participantsRouter';
import { messagesRouter } from './routes/messagesRouter';
import { conversationsRouter } from './routes/conversationsRouter';

// GLOBAL VARIABLES
const app: Express = express();
const PORT: string | 3000 = process.env.PORT || 3000;

// WEBSOCKET HTTP SERVER
const server: any = http.createServer(app);
const wss = new WebSocket.Server({ server });

// CORS MIDDLEWARE
const corsOptions: CorsOptions = {
  origin: ['http://localhost:4200', 'https://orange-tree-0d3c88e0f.3.azurestaticapps.net'],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
};
app.use(express.json());
app.use(cors(corsOptions));


// SERVER ROUTES
app
  .use('/api/translate', translationRouter)
  .use('/api/users', usersRouter)
  .use('/api/participants', participantsRouter)
  .use('/api/messages', messagesRouter)
  .use('/api/conversations', conversationsRouter);

// HANDLE PREFLIGHT REQUESTS
app.options('*', cors(corsOptions));

// WILDCARD ENDPOINT
app.use('*', (req, res): void => {
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
app.listen(PORT, (): void => {
  console.log(`API Server listening on port: ${ PORT }...`);
});

// RUN WEBSOCKET SERVER
// wsServer.listen(WS_PORT, (): void => {
//   console.log(`WebSocket Server listening on port: ${ WS_PORT }`);
// });
