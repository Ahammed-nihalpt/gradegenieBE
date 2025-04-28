// src/routes/authRoutes.ts
import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controller/authController';

const router = express.Router();
const authController = new AuthController();

router.post(
  '/signup',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('plan')
      .isIn(['educator', 'department', 'institution'])
      .withMessage('Plan must be educator, department, or institution'),
    body('billingCycle')
      .isIn(['monthly', 'yearly'])
      .withMessage('Billing cycle must be monthly or yearly'),
  ],
  authController.signup
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  authController.login
);

export default router;
