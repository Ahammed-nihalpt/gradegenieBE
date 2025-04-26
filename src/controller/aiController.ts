import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AIService } from '../services/aiServices';

export class AIController {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  public generateContent = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const result = await this.aiService.generateAssignmentContent(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
