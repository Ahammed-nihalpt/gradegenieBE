// src/routes/submissionRoutes.ts
import express from 'express';
import { AssignmentSubmissionController } from '../controller/assignmentSubmissionController';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = express.Router();
const submissionController = new AssignmentSubmissionController();

// Route to add a new submission or continue from where the user left off
router.post('/add', uploadMiddleware, submissionController.createSubmission);

// Route to edit an existing submission (e.g., updating grade/status)
router.put('/edit/:id', submissionController.editSubmission);
router.get('/:assignmentId/:id', submissionController.getById);

router.get(
  '/total/by/month/:userId',

  submissionController.getTotalSubmissionsThisMonth
);

export default router;
