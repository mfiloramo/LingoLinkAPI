import express, { Router } from 'express';
import { conversationsController } from "../controllers/conversationsController";


const router: Router = express.Router();

router.get('/:id?', conversationsController);
router.post('/', conversationsController);
router.delete('/:id?', conversationsController);
router.put('/:id?', conversationsController);


export const conversationsRouter: Router = router;