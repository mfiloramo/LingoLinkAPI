// MODULE IMPORTS
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import WebSocket from 'ws';

// ROUTE IMPORTS
import { translationRouter } from "./routes/translationRouter";
import { usersRouter } from "./routes/usersRouter";
import { participantsRouter } from "./routes/participantsRouter";
import { messagesRouter } from "./routes/messagesRouter";
import { conversationsRouter } from "./routes/conversationsRouter";
import { validateAccessToken } from './middleware/validateAccessToken';

// GLOBAL VARIABLES
const app = express();
const wss = new WebSocket.Server({ port: 8080 });
const PORT = process.env.PORT || 3000;

// CORS OPTIONS
const corsOptions: any = {
  origin: [process.env.CLIENT_URI],
  optionsSuccessStatus: 200,
  credentials: true,
};

// APPLICATION DEPENDENCIES
app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(cors(corsOptions))
  .use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// APPLICATION ENDPOINTS
app
  .use('/api/translate', validateAccessToken, translationRouter)
  .use('/api/users', validateAccessToken, usersRouter)
  .use('/api/participants', validateAccessToken, participantsRouter)
  .use('/api/messages', validateAccessToken, messagesRouter)
  .use('/api/conversations', validateAccessToken, conversationsRouter);

// WILDCARD ENDPOINT
app.use('*', (req, res) => {
  res.status(404).send('Resource not found');
})

// WEBSOCKET SERVER
wss.on('connection', (ws) => {
  // INDICATE CLIENT CONNECTION
  console.log('Client connected...');

  // BROADCAST WEBSOCKET DATA TO CLIENTS
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
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
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}...`);
});