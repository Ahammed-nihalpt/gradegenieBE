// src/controller/submissionController.ts
import { Request, Response } from 'express';
import Submission from '../models/AssignmentSubmission';
import { validationResult } from 'express-validator/lib';

export class AssignmentSubmissionController {
  // Add a new submission or continue an existing one
  async addSubmission(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { assignmentId, studentId, url } = req.body;
      const fileUrl = url || '';
      // Check if a submission exists for this student for the given assignment
      let submission = await Submission.findOne({ assignmentId, studentId });
      if (!submission) {
        // Create a new submission if it doesn't exist
        submission = new Submission({ assignmentId, studentId, fileUrl, status: 'pending' });
        await submission.save();
        res.status(201).json(submission);
        return;
      }

      // If submission exists, return the existing submission data
      res.status(200).json(submission);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  }

  // Edit an existing submission (update grade or status)
  async editSubmission(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { grade, status } = req.body;
      const submissionId = req.params.id;

      const submission = await Submission.findById(submissionId);
      if (!submission) {
        res.status(404).json({ message: 'Submission not found' });
        return;
      }

      if (grade !== undefined) {
        submission.grade = grade;
      }
      if (status !== undefined) {
        submission.status = status;
      }

      await submission.save();
      res.status(200).json(submission);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  }
}
