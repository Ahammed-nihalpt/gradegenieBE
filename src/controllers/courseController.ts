import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Course from '../models/Course';
import Assignment from '../models/Assignment';

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
        course = await Course.findByIdAndUpdate(
          courseId,
          { ...courseData },
          { new: true }
        );
        if (!course) {
          res.status(404).json({ message: 'Course not found.' });
          return;
        }
      } else {
        // Create new draft
        course = await Course.create(courseData);
        // Return the course ID after creating a new course
        res.status(200).json({ courseId: course._id });
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

  // Get Course by ID (for continuing form)
  async getCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const course = await Course.findById(id).populate('assignments').exec();
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
  async getCourseByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const courses = await Course.find({ userId });
      if (!courses || courses.length === 0) {
        res.status(404).json({ message: 'Courses not found.' });
        return;
      }
      const coursesWithAssignments = await Promise.all(
        courses.map(async (course) => {
          const assignmentCount = await Assignment.countDocuments({
            courseId: course._id,
          });
          return {
            ...course.toObject(), // Convert Mongoose doc to plain JS object
            assignmentCount: assignmentCount,
          };
        })
      );

      res.status(200).json({ courses: coursesWithAssignments });
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

      const course = await Course.findByIdAndUpdate(
        id,
        { isDraft: false },
        { new: true }
      );

      if (!course) {
        res.status(404).json({ message: 'Course not found.' });
        return;
      }

      res
        .status(200)
        .json({ message: 'Course finalized successfully.', course });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
      return;
    }
  }
}
