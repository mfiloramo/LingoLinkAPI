// MODULE IMPORTS
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import WebSocket from 'ws';

// ROUTE IMPORTS
import { translationRouter } from "./routes/translationRouter";

// GLOBAL VARIABLES
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ port: 8080 });
const PORT = 3000;

// CORS OPTIONS
const corsOptions: object = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true
};

// APPLICATION DEPENDENCIES
app
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors(corsOptions))

// ROUTE PROTECTION (PASSPORT, MSAL)
// ...

// APPLICATION ENDPOINTS
app.use('/api', translationRouter);

// WEBSOCKET SERVER
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${JSON.stringify(message)}`);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// RUN EXPRESS SERVER
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}...`);
});