import express, { Router, Request, Response } from 'express';
import { translateText } from "../controllers/translation.controller";


const router: Router = express.Router();

router.post('/', translateText);

export const translationRouter: Router = router;
