import express from 'express';
import auth from '../middlewares/auth.js';
import { check } from '../controllers/check.js';

const router = express.Router();

router.use(auth);

router.post('/check', check);

export default router;
