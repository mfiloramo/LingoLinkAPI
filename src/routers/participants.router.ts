import express, { Router } from 'express';
import {
  createNewParticipant,
  deleteParticipant,
  selectAllParticipants,
  selectParticipant
} from "../controllers/participants.controller";


const router: Router = express.Router();

router.get('/', selectAllParticipants);
router.get('/:id?', selectParticipant);
router.post('/', createNewParticipant);
router.delete('/:id?', deleteParticipant);


export const participantsRouter: Router = router;