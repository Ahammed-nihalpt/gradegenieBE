import express, { Router } from 'express';
import authRoutes from './authRoutes';
import assignmentRoutes from './assignmentRoutes';

const router: Router = express.Router();

router.use('/auth', authRoutes);
router.use('/assignment', assignmentRoutes);

export default router;
