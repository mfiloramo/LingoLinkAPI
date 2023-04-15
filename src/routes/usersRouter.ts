import express, { Router, Request, Response } from 'express';
import { usersController } from "../controllers/usersController";
import { validateAccessToken } from "../middleware/validateAccessToken";

const router: Router = express.Router();

router.get('/:id?', validateAccessToken, usersController);
router.post('/', validateAccessToken, usersController);
router.delete('/:id?', validateAccessToken, usersController);
router.put('/:id?', validateAccessToken, usersController);


export const usersRouter: Router = router;