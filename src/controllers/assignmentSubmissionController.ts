import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Submission from '../models/AssignmentSubmission'; // adjust the path if needed
import mongoose from 'mongoose';
import grading from '../services/ai/aiBulkGrading';
import Assignment from '../models/Assignment';
import axios from 'axios';
import path from 'path';
import { mapAiGradesToSubmission } from '../utilities/mapAiGradesToSubmission';

export class AssignmentSubmissionController {
  // Create a new submission
  async createSubmission(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      let { files, ...submissionData } = req.body;
      const assignment = await Assignment.findOne({
        _id: submissionData.assignmentId,
      }).populate('courseId', 'name');
      if (!assignment) {
        res.status(404).json({
          message: 'Assignment not found',
          error: 'Assignment not found',
        });
      }
      const {
        error,
        message: aiError,
        json: aiGrades,
      } = await grading(
        (assignment?.courseId as any)?.name,
        assignment?.assignmentType || 'Eassy',
        assignment?.rubric || '',
        submissionData.content
      );

      if (!aiGrades) {
        res.status(500).json({ message: 'Something went wrong', error: '' });
        return;
      }
      if (!error) {
        submissionData = mapAiGradesToSubmission(submissionData, aiGrades);
      } else if (error) {
        submissionData.aiError = aiError;
      }

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

  async recheckAIGrading(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const submission = await Submission.findById(id);
      if (!submission) {
        res.status(404).json({ message: 'Submission not found' });
        return;
      }

      const assignment = await Assignment.findById(
        submission.assignmentId
      ).populate('courseId', 'name');

      if (!assignment) {
        res.status(404).json({ message: 'Assignment not found' });
        return;
      }

      const {
        error,
        message: aiError,
        json: aiGrades,
      } = await grading(
        (assignment?.courseId as any)?.name,
        assignment?.assignmentType || 'Essay',
        assignment?.rubric || '',
        submission?.content || ''
      );

      if (error) {
        submission.aiError = aiError;
        await submission.save();
        res.status(200).json({
          message: 'AI recheck completed with error',
          aiError,
          data: submission,
        });
        return;
      }
      if (!aiGrades) {
        res.status(500).json({ message: 'Server error', error: '' });
        return;
      }
      mapAiGradesToSubmission(submission, aiGrades);
      submission.aiError = '';
      await submission.save();

      res.status(200).json({
        message: 'AI recheck successful',
        data: submission,
      });
    } catch (err) {
      console.error('Error during AI recheck:', err);
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

      const submission = await Submission.findOne({
        assignmentId,
        _id: id,
      }).populate({
        path: 'studentId', // populate inside each submission
        model: 'Student', // model name of Student
        select: 'name email', // 🔥 select only needed fields (optional)
      });
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

  async downloadFiles(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const submission = await Submission.findOne({
        _id: id,
      });

      if (!submission?.fileUrl?.length || submission?.fileUrl?.length <= 0) {
        res.status(400).json({ error: 'No file found' });
        return;
      }
      const response = await axios.get(submission?.fileUrl?.[0] || '', {
        responseType: 'stream',
      });

      const fileName = path.basename(submission?.fileUrl?.[0]);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`
      );
      res.setHeader('Content-Type', response.headers['content-type']);

      response.data.pipe(res);
    } catch (error) {
      res.status(500).json({ error: 'Failed to download file' });
    }
  }
}
