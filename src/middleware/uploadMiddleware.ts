import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary'; // Adjust the import path
import { v4 as uuidv4 } from 'uuid';
import { FileProcessor } from '../utilities/fileProcessor';

// Setup multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware for handling both single and multiple file uploads
export const uploadMiddleware: Array<
  (req: Request, res: Response, next: NextFunction) => void | Promise<void>
> = [
  upload.any(), // Accepts both single and multiple files (dynamically)
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    try {
      const uploadedFiles: string[] = [];

      // Loop through the uploaded files and upload each to Cloudinary
      for (const file of req.files as Express.Multer.File[]) {
        const fileBuffer = file.buffer as Buffer;

        // Upload each file to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`,
          {
            public_id: uuidv4(),
            resource_type: 'auto',
          },
        );

        // Add the file URL to the uploaded files array
        uploadedFiles.push(uploadResponse.secure_url);
      }
      const fileProcessor = new FileProcessor(req.files as Express.Multer.File[]);
      const combinedText = await fileProcessor.extractAndCombineText();
      // Assign the array of file URLs to req.body.files
      req.body.files = uploadedFiles;
      req.body.content = combinedText;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ error: 'Failed to upload files to Cloudinary' });
    }
  },
];
