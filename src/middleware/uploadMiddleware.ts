// src/middleware/uploadMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.memoryStorage();
const upload = multer({ storage });

// This is the middleware for handling the upload and forwarding it to Cloudinary
export const uploadMiddleware: Array<
  (req: Request, res: Response, next: NextFunction) => void | Promise<void>
> = [
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    try {
      const fileBuffer = req.file.buffer as Buffer;

      // Upload the file to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`,
        {
          public_id: uuidv4(),
          resource_type: 'auto',
        },
      );

      // Add the Cloudinary URL and public_id to the request object
      req.body.url = uploadResponse.secure_url;
      req.body.public_id = uploadResponse.public_id;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
      return;
    }
  },
];
