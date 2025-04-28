import express, { Router } from 'express';
import authRoutes from './authRoutes';
import assignmentRoutes from './assignmentRoutes';
import submissionRoutes from './assignmentSubmissionRoutes';
import studentRoutes from './studentRoutes';
import teacherRoutes from './teacherRoutes';
import courseRoutes from './courseRoutes';
import { authenticateToken } from '../middleware/authenticateTokenMiddleware';

const router: Router = express.Router();
router.use('/auth', authRoutes);

// Protected routes
router.use(authenticateToken);
router.use('/assignment', assignmentRoutes);
router.use('/submission', submissionRoutes);
router.use('/student', studentRoutes);
router.use('/teacher', teacherRoutes);
router.use('/course', courseRoutes); // Assuming you want to use the same routes for course

export default router;
