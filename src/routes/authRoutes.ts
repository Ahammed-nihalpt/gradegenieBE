// src/routes/authRoutes.ts
import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controller/authController';

const router = express.Router();
const authController = new AuthController();

router.post(
  '/signup',
  [body('fullName').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 })],
  authController.signup,
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], authController.login);

export default router;
