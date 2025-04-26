import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Course from '../models/Course';

export class CourseController {
  // Create or Update Course (multi-step)
  async saveCourse(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { courseId, ...courseData } = req.body;

      let course;

      if (courseId) {
        // Update existing draft
        course = await Course.findByIdAndUpdate(courseId, { ...courseData }, { new: true });
        if (!course) {
          res.status(404).json({ message: 'Course not found.' });
          return;
        }
      } else {
        // Create new draft
        course = await Course.create(courseData);
      }

      res.status(200).json({ course });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
      return;
    }
  }

  // Get Course by ID (for continuing form)
  async getCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
      if (!course) {
        res.status(404).json({ message: 'Course not found.' });
        return;
      }

      res.status(200).json({ course });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
      return;
    }
  }

  // Finalize Course (optional)
  async finalizeCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const course = await Course.findByIdAndUpdate(id, { isDraft: false }, { new: true });

      if (!course) {
        res.status(404).json({ message: 'Course not found.' });
        return;
      }

      res.status(200).json({ message: 'Course finalized successfully.', course });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
      return;
    }
  }
}
