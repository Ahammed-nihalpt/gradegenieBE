import express from 'express';
import { body } from 'express-validator';
import { AIController } from '../controller/aiController';
import { authenticateToken } from '../middleware/authenticateToken';

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

router.post('/generate', validateAiContent, aiController.generateContent);

export default router;
