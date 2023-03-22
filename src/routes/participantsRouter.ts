import express, { Router } from 'express';
import { participantsController } from "../controllers/participantsController";


const router: Router = express.Router();

router.get('/:id?', participantsController);
router.post('/', participantsController);
router.delete('/:id?', participantsController);
router.put('/:id?', participantsController);


export const participantsRouter: Router = router;