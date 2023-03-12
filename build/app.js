"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// APPLICATION DEPENDENCIES
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
// CORS OPTIONS
const corsOptions = {
    origin: [process.env.CLIENT_URI],
    optionsSuccessStatus: 200,
    credentials: true,
};
// APPLICATION OUTPUT
app
    .use(express_1.default.json())
    .use(express_1.default.urlencoded({ extended: false }))
    .use(body_parser_1.default.urlencoded({ extended: true }))
    .use((0, cors_1.default)(corsOptions));
// BASIC ENDPOINT
app.get('/', (req, res) => {
    res.send('Goodbye, World!');
});
// APPLICATION ROUTE IMPORTS
// ...
// APPLICATION ENDPOINTS
// ...
// RUN APPLICATION SERVER
app.listen(port, () => {
    console.log(`Connected. Listening on port: ${port}...`);
});
