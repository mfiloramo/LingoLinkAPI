import express, { Router } from 'express';
import {
  createNewMessage, deleteExistingMessage,
  selectAllMessages,
  selectMessagesByConversationId, updateExistingMessage
} from "../controllers/messages.controller";


const router: Router = express.Router();

router.get('/', selectAllMessages);
router.get('/:id?', selectMessagesByConversationId);
router.post('/', createNewMessage);
router.put('/:id?', updateExistingMessage);
router.delete('/:id?', deleteExistingMessage);


export const messagesRouter: Router = router;