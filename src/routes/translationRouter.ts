import express, { Router, Request, Response } from 'express';
import TranslationController from "../controllers/translation.controller";


const router: Router = express.Router();

router.post('/', TranslationController.translateText);

export const translationRouter: Router = router;
