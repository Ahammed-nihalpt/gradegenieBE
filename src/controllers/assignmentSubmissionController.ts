import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Submission from '../models/AssignmentSubmission'; // adjust the path if needed
import mongoose from 'mongoose';

export class AssignmentSubmissionController {
  // Create a new submission
  async createSubmission(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { files, ...submissionData } = req.body;

      submissionData.aiCheckerResults = {
        score: 92,
        confidence: 'High',
        details: [
          {
            section: 'Introduction',
            aiProbability: 0.15,
            humanProbability: 0.85,
          },
          { section: 'Main Body', aiProbability: 0.08, humanProbability: 0.92 },
          {
            section: 'Conclusion',
            aiProbability: 0.12,
            humanProbability: 0.88,
          },
        ],
      };

      submissionData.subScores = [
        {
          name: 'Content',
          score: 0,
          maxScore: 100,
          rationale:
            'The essay covers the topic comprehensively and uses reliable sources.',
        },
        {
          name: 'Organization',
          score: 0,
          maxScore: 100,
          rationale:
            'Good structure overall, but transitions between paragraphs could be smoother.',
        },
        {
          name: 'Grammar',
          score: 0,
          maxScore: 100,
          rationale:
            'A few minor grammatical errors, but generally well-written.',
        },
        {
          name: 'Citations',
          score: 0,
          maxScore: 100,
          rationale:
            'Sources are cited correctly, but could use more diverse references.',
        },
      ];

      submissionData.fileUrl = files || []; // Assign the uploaded file URLs to the submission data

      const submission = new Submission(submissionData);
      await submission.save();

      res.status(201).json({
        message: 'Submission created successfully',
        data: submission,
      });
    } catch (err) {
      console.error('Error creating submission:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }

  // Update an existing submission
  async editSubmission(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const submissionId = req.params.id;
      const updateData = req.body;

      if (updateData.score) {
        updateData.status = 'Graded';
      }

      const submission = await Submission.findById(submissionId);
      if (!submission) {
        res.status(404).json({ message: 'Submission not found' });
        return;
      }

      // Update only the fields provided
      Object.assign(submission, updateData);

      await submission.save();

      res.status(200).json({
        message: 'Submission updated successfully',
        data: submission,
      });
    } catch (err) {
      console.error('Error updating submission:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id, assignmentId } = req.params;

      const submission = await Submission.findOne({ assignmentId, _id: id });
      if (!submission) {
        res.status(404).json({ message: 'Submission not found' });
        return;
      }

      res.status(200).json({
        message: 'Submission found',
        submission,
      });
    } catch (err) {
      console.error('Error updating submission:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }

  async getTotalSubmissionsThisMonth(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const now = new Date();

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      const totalSubmissions = await Submission.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $lookup: {
            from: 'assignments', // Collection name of Assignment
            localField: 'assignmentId',
            foreignField: '_id',
            as: 'assignment',
          },
        },
        {
          $unwind: '$assignment',
        },
        {
          $lookup: {
            from: 'courses', // Collection name of Course
            localField: 'assignment.courseId',
            foreignField: '_id',
            as: 'course',
          },
        },
        {
          $unwind: '$course',
        },
        {
          $match: {
            'course.userId': new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $count: 'total',
        },
      ]);

      res.status(200).json({
        message: 'Total submissions this month fetched successfully',
        total:
          totalSubmissions && totalSubmissions.length === 1
            ? totalSubmissions[0].total
            : 0,
      });
      return;
    } catch (err) {
      console.error('Error fetching total submissions:', err);
      res.status(500).json({ message: 'Server error', error: err });
      return;
    }
  }
}
