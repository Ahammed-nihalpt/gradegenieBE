import express from 'express';
import { body } from 'express-validator';
import { CourseController } from '../controller/courseController';

const router = express.Router();
const courseController = new CourseController();

// Save or Update course (draft or progress)
router.post('/course/save', courseController.saveCourse);

// Get course by id
router.get('/course/:id', courseController.getCourse);

// Finalize course (mark draft as complete)
router.post('/course/finalize/:id', courseController.finalizeCourse);

export default router;
