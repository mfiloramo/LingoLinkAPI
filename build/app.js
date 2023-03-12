"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
// GLOBAL VARIABLES
const app = (0, express_1.default)();
const port = 3000;
// CORS OPTIONS
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true,
};
// APPLICATION DEPENDENCIES
app
    .use(express_1.default.json())
    .use(express_1.default.urlencoded({ extended: false }))
    .use(body_parser_1.default.urlencoded({ extended: true }))
    .use((0, cors_1.default)(corsOptions));
// ROUTE PROTECTION (PASSPORT, MSAL)
// ...
// APPLICATION ROUTE IMPORTS
const translationRouter_1 = require("./routes/translationRouter");
// APPLICATION ENDPOINTS
app.use('/api', translationRouter_1.translationRouter);
// DEBUG: TEST ENDPOINT
app.get('/', (req, res) => {
    res.json();
});
// RUN APPLICATION SERVER
app.listen(port, () => {
    console.log(`Connected, listening on port: ${port}...`);
});
