import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { generateTokenForSftp } from '../utilities/jwt';

export class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      res.status(201).json({ message: 'User created', userId: newUser._id });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const token = generateTokenForSftp({ userId: user._id });
      res.status(200).json({
        message: 'Login successful',
        token: `Bearer ${token}`,
        id: user._id,
        name: user.fullName,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
