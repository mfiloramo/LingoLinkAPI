import express, { Router } from 'express';
import { validateUser, sendRegNotifications, approveUserRegistration, declineUserRegistration } from '../controllers/auth.controller';


const router: Router = express.Router();

router.get('/', validateUser);
router.get('/notify', sendRegNotifications);
router.get('/approve/:token', approveUserRegistration);
router.get('/decline/:token', declineUserRegistration);


export const authRouter: Router = router;