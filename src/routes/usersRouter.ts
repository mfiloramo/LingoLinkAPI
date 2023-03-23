import express, { Router, Request, Response } from 'express';
import { usersController } from "../controllers/usersController";


const router: Router = express.Router();

router.get('/:id?', usersController);
router.post('/', usersController);
router.delete('/:id?', usersController);
router.put('/:id?', usersController);


export const usersRouter: Router = router;