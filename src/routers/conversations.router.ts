import express, { Router } from 'express';
import {
  createConversation, deleteConversation,
  selectAllConversations,
  selectConversationsByUserId, updateConversation
} from "../controllers/conversations.controller";


const router: Router = express.Router();

router.get('/:id?', selectConversationsByUserId);
router.get('/', selectAllConversations);
router.post('/', createConversation);
router.put('/:id?', updateConversation);
router.delete('/:id?', deleteConversation);


export const conversationsRouter: Router = router;