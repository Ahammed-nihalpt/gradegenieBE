import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Student from '../models/Student'; // adjust path if needed

export class StudentController {
  // Create a new student
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
        message: 'Student created successfully',
        data: student,
      });
    } catch (err) {
      console.error('Error creating student:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }

  // Update an existing student
  async edit(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = req.params.id;
      const updateData = req.body;

      const student = await Student.findById(id);
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }

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

  // Get student by ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const student = await Student.findById(id);
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }

      res.status(200).json({
        message: 'Student found',
        data: student,
      });
    } catch (err) {
      console.error('Error fetching student by ID:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }

  // Get students by userId
  async getByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const students = await Student.find({ userId });
      if (!students.length) {
        res.status(404).json({ message: 'No students found for this user' });
        return;
      }

      res.status(200).json({
        message: 'Students found',
        data: students,
      });
    } catch (err) {
      console.error('Error fetching students by userId:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }
}
