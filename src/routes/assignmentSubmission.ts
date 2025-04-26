// src/routes/submissionRoutes.ts
import express from 'express';
import { body } from 'express-validator';
import { AssignmentSubmissionController } from '../controller/assignmentSubmissionController';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = express.Router();
const submissionController = new AssignmentSubmissionController();

// Route to add a new submission or continue from where the user left off
router.post(
  '/add',
  ...uploadMiddleware,
  [
    body('assignmentId').notEmpty().withMessage('Assignment ID is required'),
    body('studentId').notEmpty().withMessage('Student ID is required'),
  ],
  submissionController.addSubmission,
);

// Route to edit an existing submission (e.g., updating grade/status)
router.put(
  '/edit/:id',
  [
    body('grade')
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage('Grade must be a number between 0 and 100'),
    body('status')
      .optional()
      .isIn(['submitted', 'graded', 'pending'])
      .withMessage('Invalid status'),
  ],
  submissionController.editSubmission,
);

export default router;
