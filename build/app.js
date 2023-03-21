"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MODULE IMPORTS
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
// ROUTE IMPORTS
const translationRouter_1 = require("./routes/translationRouter");
const usersRouter_1 = require("./routes/usersRouter");
const participantsRouter_1 = require("./routes/participantsRouter");
const messagesRouter_1 = require("./routes/messagesRouter");
const conversationsRouter_1 = require("./routes/conversationsRouter");
// GLOBAL VARIABLES
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.default.Server({ port: 8080 });
const PORT = 3000;
// CORS OPTIONS
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true
};
// APPLICATION DEPENDENCIES
app
    .use(express_1.default.json())
    .use(express_1.default.urlencoded({ extended: false }))
    .use(body_parser_1.default.urlencoded({ extended: true }))
    .use((0, cors_1.default)(corsOptions));
// TODO: ROUTE PROTECTION (PASSPORT, MSAL)
// ...
// APPLICATION ENDPOINTS
app.use('/api/translate', translationRouter_1.translationRouter);
app.use('/api/users', usersRouter_1.usersRouter);
app.use('/api/participants', participantsRouter_1.participantsRouter);
app.use('/api/messages', messagesRouter_1.messagesRouter);
app.use('/api/conversations', conversationsRouter_1.conversationsRouter);
// WEBSOCKET SERVER
wss.on('connection', (ws) => {
    console.log('Client connected...');
    // BROADCAST WEBSOCKET DATA TO CLIENTS
    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws_1.default.OPEN) {
                client.send(message);
            }
        });
    });
    // INDICATE CLIENT HAS DISCONNECTED ON DISCONNECT
    ws.on('close', () => {
        console.log('Client disconnected...');
    });
});
// RUN EXPRESS SERVER
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}...`);
});
