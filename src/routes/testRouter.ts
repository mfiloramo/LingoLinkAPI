import express, { Router, Request, Response } from 'express';
import TranslationController from "../controllers/generic.controller";


const router: Router = express.Router();

router.post('/translate', TranslationController.testMethod);

export const genericRouter: Router = router;
