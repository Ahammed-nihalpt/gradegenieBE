import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Teacher from '../models/Teacher'; // Adjust the path if needed

export class TeacherController {
  // Create a new teacher
  async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { files, ...data } = req.body;

      const teacher = new Teacher(data);
      await teacher.save();

      res.status(201).json({
        message: 'Teacher created successfully',
        data: teacher,
      });
    } catch (err) {
      console.error('Error creating teacher:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }

  // Update an existing teacher
  async edit(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = req.params.id;
      const updateData = req.body;

      const teacher = await Teacher.findById(id);
      if (!teacher) {
        res.status(404).json({ message: 'Teacher not found' });
        return;
      }

      Object.assign(teacher, updateData);

      await teacher.save();

      res.status(200).json({
        message: 'Teacher updated successfully',
        data: teacher,
      });
    } catch (err) {
      console.error('Error updating teacher:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }

  // Get teacher by ID
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const teacher = await Teacher.findById(id);
      if (!teacher) {
        res.status(404).json({ message: 'Teacher not found' });
        return;
      }

      res.status(200).json({
        message: 'Teacher found',
        teacher,
      });
    } catch (err) {
      console.error('Error fetching teacher:', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }

  // Get teacher(s) by userId
  async getByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const teachers = await Teacher.find({ userId });
      if (!teachers.length) {
        res.status(404).json({ message: 'No teachers found for this user' });
        return;
      }

      res.status(200).json({
        message: 'Teachers found',
        teachers,
      });
    } catch (err) {
      console.error('Error fetching teacher(s):', err);
      res.status(500).json({ message: 'Server error', error: err });
    }
  }
}
