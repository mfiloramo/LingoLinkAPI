import express, { Router, Request, Response } from 'express';
import { messagesController } from "../controllers/messages.controller";


const router: Router = express.Router();

router.get('/:id?', messagesController);
router.post('/', messagesController);
router.delete('/:id?', messagesController);
router.put('/:id?', messagesController);


export const messagesRouter: Router = router;