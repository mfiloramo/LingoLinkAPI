// APPLICATION DEPENDENCIES
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();
const port = 3000;

// CORS OPTIONS
const corsOptions: object = {
    origin: [process.env.CLIENT_URI],
    optionsSuccessStatus: 200,
    credentials: true,
};

// APPLICATION OUTPUT
app
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cors(corsOptions))

// BASIC ENDPOINT
app.get('/', (req: Request, res: Response) => {
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