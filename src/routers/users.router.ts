import express, { Router } from 'express';
import {
  selectAllUsers,
  selectUser,
  createUser,
  updateUsername,
  deleteUser,
  updateName, emailUpdateConfirmation, updateEmail
} from "../controllers/users.controller";

// TODO: IMPLEMENT PUT METHOD FOR updateEmail

const router: Router = express.Router();

router.get('/', selectAllUsers);
router.get('/:id?', selectUser);
router.get('/update-email/:token/:userId', updateEmail);
router.post('/', createUser);
router.post('/email-update-confirm/', emailUpdateConfirmation);
router.put('/update-username/', updateUsername);
router.put('/update-name/', updateName);
router.delete('/:id?', deleteUser);


export const usersRouter: Router = router;