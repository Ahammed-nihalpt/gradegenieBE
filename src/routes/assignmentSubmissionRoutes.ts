// src/routes/submissionRoutes.ts
import express from 'express';
import { AssignmentSubmissionController } from '../controllers/assignmentSubmissionController';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = express.Router();
const submissionController = new AssignmentSubmissionController();

// Route to add a new submission or continue from where the user left off
router.post('/add', uploadMiddleware, submissionController.createSubmission);
router.post(
  '/add/multiple',
  uploadMiddleware,
  submissionController.createSubmission
);

// Route to edit an existing submission (e.g., updating grade/status)
router.put('/edit/:id', submissionController.editSubmission);
router.get('/:assignmentId/:id', submissionController.getById);
router.get('/download/file/:id', submissionController.downloadFiles);
router.put('/:id/recheck/ai', submissionController.recheckAIGrading);

router.get(
  '/total/by/month/:userId',
  submissionController.getTotalSubmissionsThisMonth
);

export default router;
