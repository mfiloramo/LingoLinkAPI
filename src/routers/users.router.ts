import express, { Router } from 'express';
import { selectAllUsers, selectUser, createUser, updateUser, deleteUser } from "../controllers/users.controller";


const router: Router = express.Router();

router.get('/', selectAllUsers);
router.get('/:id?', selectUser);
router.post('/', createUser);
router.put('/:id?', updateUser);
router.delete('/:id?', deleteUser);


export const usersRouter: Router = router;