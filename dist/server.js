"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MODULE IMPORTS
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// ROUTE IMPORTS
const translationRouter_1 = require("./routes/translationRouter");
const usersRouter_1 = require("./routes/usersRouter");
const participantsRouter_1 = require("./routes/participantsRouter");
const messagesRouter_1 = require("./routes/messagesRouter");
const conversationsRouter_1 = require("./routes/conversationsRouter");
// GLOBAL VARIABLES
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// WEBSOCKET HTTP SERVER
// const WS_PORT: number = 3030;
// const wsServer = http.createServer((req, res): void => {
//   res.writeHead(404, { 'Content-Type': 'text/plain' });
//   res.end('Not found');
// });
// const wss = new WebSocket.Server({ server: wsServer });
// CORS MIDDLEWARE
const corsOptions = {
    origin: ['http://localhost:4200', 'https://orange-tree-0d3c88e0f.3.azurestaticapps.net'],
    optionsSuccessStatus: 200,
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
};
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
// SERVER ROUTES
app
    .use('/api/translate', translationRouter_1.translationRouter)
    .use('/api/users', usersRouter_1.usersRouter)
    .use('/api/participants', participantsRouter_1.participantsRouter)
    .use('/api/messages', messagesRouter_1.messagesRouter)
    .use('/api/conversations', conversationsRouter_1.conversationsRouter);
// HANDLE PREFLIGHT REQUESTS
app.options('*', (0, cors_1.default)(corsOptions));
// WILDCARD ENDPOINT
app.use('*', (req, res) => {
    res.status(404).send('Resource not found');
});
// WEBSOCKET SERVER
// wss.on('connection', (ws: WebSocket): void => {
//   // INDICATE CLIENT CONNECTION
//   console.log('Client connected...');
//
//   // BROADCAST WEBSOCKET DATA TO CLIENTS
//   ws.on('message', (message: WebSocket.Data): void => {
//     wss.clients.forEach((client: WebSocket.WebSocket): void => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         client.send(message);
//       }
//     });
//   });
//
//   ws.on('close', () => {
//     // INDICATE CLIENT DISCONNECTION
//     console.log('Client disconnected...');
//   });
// });
// RUN EXPRESS SERVER
app.listen(PORT, () => {
    console.log(`API Server listening on port: ${PORT}...`);
});
// RUN WEBSOCKET SERVER
// wsServer.listen(WS_PORT, (): void => {
//   console.log(`WebSocket Server listening on port: ${ WS_PORT }`);
// });
