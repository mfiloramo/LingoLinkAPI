import express, { Router } from 'express';
import {
  validateUser,
  sendUserRegNotifications,
  approveUserRegistration,
  declineUserRegistration,
  changePassword
} from '../controllers/auth.controller';


const router: Router = express.Router();

router.get('/', validateUser);
router.get('/notify', sendUserRegNotifications);
router.get('/approve/:token', approveUserRegistration);
router.get('/decline/:token', declineUserRegistration);
router.post('/change-password', changePassword);


export const authRouter: Router = router;