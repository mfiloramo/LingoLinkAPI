"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// MODULE IMPORTS
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
// GLOBAL VARIABLES
const app = (0, express_1.default)();
const wss = new ws_1.default.Server({ port: 8080 });
const PORT = process.env.PORT || 3000;
// WILDCARD ENDPOINT
app.use('*', (req, res) => {
    res.status(404).send('Resource not found');
});
// WEBSOCKET SERVER
wss.on('connection', (ws) => {
    // SET CORS HEADERS
    const headers = {
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
    ws.on('message', (message) => {
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws_1.default.OPEN) {
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
