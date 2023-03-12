import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';


// GLOBAL VARIABLES
const app = express();
const port = 3000;

// CORS OPTIONS
const corsOptions: object = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200,
    credentials: true,
};

// APPLICATION DEPENDENCIES
app
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors(corsOptions))

// ROUTE PROTECTION (PASSPORT, MSAL)
// ...

// APPLICATION ROUTE IMPORTS
import { translationRouter } from "./routes/translationRouter";

// APPLICATION ENDPOINTS
app.use('/api', translationRouter);

// DEBUG: TEST ENDPOINT
app.get('/', (req: Request, res: Response) => {
    res.json();
});

// RUN APPLICATION SERVER
app.listen(port, () => {
    console.log(`Connected, listening on port: ${port}...`);
});