import express, { Router } from 'express';
import {
  selectAllUsers,
  selectUser,
  createUser,
  updateUsername,
  deleteUser,
  updateName
} from "../controllers/users.controller";


const router: Router = express.Router();

router.get('/', selectAllUsers);
router.get('/:id?', selectUser);
router.post('/', createUser);
router.put('/update-username/', updateUsername);
router.put('/update-name/', updateName);
router.delete('/:id?', deleteUser);


export const usersRouter: Router = router;