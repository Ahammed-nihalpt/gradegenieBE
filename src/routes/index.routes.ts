import express, { Router } from 'express';
import authRoutes from './authRoutes';
import aiRoutes from './aiRoutes';

const router: Router = express.Router();

router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);

export default router;
