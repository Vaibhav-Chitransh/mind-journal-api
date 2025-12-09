import express from 'express';
import { getMe, loginUser, registerUser } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', ProcessingInstruction, getMe);

export default router;