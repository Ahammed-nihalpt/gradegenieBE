import express from 'express';
import { body } from 'express-validator';
import { AIController } from '../controllers/assignmentController';

const router = express.Router();
const aiController = new AIController();

// Validation Middleware
const validateAiContent = [
  body('assignmentType').notEmpty(),
  body('subType').isArray({ min: 1 }),
  body('title').notEmpty(),
  body('course').notEmpty(),
  body('description').notEmpty(),
];

router.post('/ai/generate', validateAiContent, aiController.generateContent);
router.post(
  '/add',

  [
    body('assignmentType')
      .isString()
      .withMessage('Assignment type is required'),
    body('subType').isArray().withMessage('SubType should be an array'),
    body('title').isString().withMessage('Title is required'),
    body('courseId').isString().withMessage('Course is required'),
    body('userId').isString().withMessage('User is required'),
    body('totalPoints')
      .optional()
      .isNumeric()
      .withMessage('Total points must be a number'),
    body('instructions')
      .optional()
      .isString()
      .withMessage('Response instructions are required'),
    body('rubric').optional().isString().withMessage('Rubric are required'),
    body('dueDate')
      .optional()
      .optional()
      .isString()
      .withMessage('Due date must be a string'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description is required'),
    body('learningObjectives')
      .optional()
      .isString()
      .withMessage('Learning objectives must be a string'),
  ],
  aiController.addAssignment
);

router.put(
  '/edit/:id',
  [
    body('title').optional().isString().withMessage('Title should be a string'),
    body('description')
      .optional()
      .isString()
      .withMessage('Description should be a string'),
    body('learningObjectives')
      .optional()
      .isString()
      .withMessage('Learning objectives should be a string'),
    body('dueDate')
      .optional()
      .isString()
      .withMessage('Due date should be a string'),
    body('totalPoints')
      .optional()
      .isNumeric()
      .withMessage('Total points should be a number'),
    body('responseInstructions')
      .optional()
      .isString()
      .withMessage('Response instructions should be a string'),
    body('assignmentType')
      .optional()
      .isString()
      .withMessage('Assignment type should be a string'),
  ],
  aiController.editAssignment
);

router.get('/by/user/:userId', aiController.getByUserAssignment);
router.get('/:id', aiController.getAssignmentById);

export default router;
