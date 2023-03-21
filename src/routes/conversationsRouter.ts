import express, { Router, Request, Response } from 'express';


const router: Router = express.Router();

router.get('/:id?', conversationsController.cconversationsController);
router.post('/', conversationsController.cconversationsController);
router.delete('/:id?', conversationsController.cconversationsController);
router.put('/:id?', conversationsController.cconversationsController);


export const conversationsRouter: Router = router;