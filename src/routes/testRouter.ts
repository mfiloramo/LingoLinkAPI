import express, { Router, Request, Response } from 'express';
import GenericController from "../controllers/generic.controller";


const router: Router = express.Router();

router.post('/translate', GenericController.testMethod);

export const genericRouter: Router = router;
