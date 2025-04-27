import express from 'express';
import { body } from 'express-validator';
import { CourseController } from '../controller/courseController';

const router = express.Router();
const courseController = new CourseController();

// Save or Update course (draft or progress)
router.post('/save', courseController.saveCourse);

// Get course by id
router.get('/:id', courseController.getCourse);

// Get all courses by user id
router.get('/by/user/:userId', courseController.getCourseByUser);

// Finalize course (mark draft as complete)
router.post('/finalize/:id', courseController.finalizeCourse);

export default router;
