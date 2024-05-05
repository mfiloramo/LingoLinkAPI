import express, { Router } from 'express';
import {
  selectAllUsers,
  selectUser,
  createUser,
  updateUsername,
  deleteUser,
  updateName, emailUpdateConfirmation, updateEmail
} from "../controllers/users.controller";


const router: Router = express.Router();

router.get('/', selectAllUsers);
router.get('/:id?', selectUser);
router.post('/', createUser);
router.post('/email-update-confirm/', emailUpdateConfirmation);
router.put('/update-username/', updateUsername);
router.put('/update-name/', updateName);
router.put('/update-email/', updateEmail);
router.delete('/:id?', deleteUser);


export const usersRouter: Router = router;