import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Submission from '../models/AssignmentSubmission'; // adjust the path if needed
import Student from '../models/Student';

export class StudentController {
  // Create a new submission
  async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { files, ...data } = req.body;

      const student = new Student(data);
      await student.save();

      res.status(201).json({
        message: 'created successfully',
        data: student,
      });
    } catch (err) {
      console.error('Error creating student:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }

  // Update an existing
  async edit(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = req.params.id;
      const updateData = req.body;

      if (updateData.score) {
        updateData.status = 'Graded';
      }

      const student = await Student.findById(id);
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }

      // Update only the fields provided
      Object.assign(student, updateData);

      await student.save();

      res.status(200).json({
        message: 'Student updated successfully',
        data: student,
      });
    } catch (err) {
      console.error('Error updating student:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const student = await Student.findOne({ _id: id });
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }

      res.status(200).json({
        message: 'Student found',
        student,
      });
    } catch (err) {
      console.error('Error updating student:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }
  async getByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const student = await Student.find({ userId });
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }

      res.status(200).json({
        message: 'Student found',
        student,
      });
    } catch (err) {
      console.error('Error updating student:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }
}
