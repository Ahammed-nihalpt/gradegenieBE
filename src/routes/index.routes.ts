import express, { Router } from 'express';
import authRoutes from './authRoutes';
import assignmentRoutes from './assignmentRoutes';
import courseRoutes from './courseRoutes';

const router: Router = express.Router();

router.use('/auth', authRoutes);
router.use('/assignment', assignmentRoutes);
router.use('/course', courseRoutes); // Assuming you want to use the same routes for course

export default router;
