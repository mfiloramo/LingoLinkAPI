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

// ROUTES
app.use('/api/translate', validateAccessToken, translationRouter);
app.use('/api/users', validateAccessToken, usersRouter);
app.use('/api/participants', validateAccessToken, participantsRouter);
app.use('/api/messages', validateAccessToken, messagesRouter);
app.use('/api/conversations', validateAccessToken, conversationsRouter);

// WILDCARD ENDPOINT
app.use('*', (req, res) => {
  res.status(404).send('Resource not found');
});

// WEBSOCKET SERVER
wss.on('connection', (ws: any) => {
  // SET CORS HEADERS
  const headers: any = {
    "Access-Control-Allow-Origin": process.env.CLIENT_URI,
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
  };
  Object.keys(headers).forEach((key) => {
    ws.set(key, headers[key]);
  });

  // INDICATE CLIENT CONNECTION
  console.log('Client connected...');

  // BROADCAST WEBSOCKET DATA TO CLIENTS
  ws.on('message', (message: any) => {
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