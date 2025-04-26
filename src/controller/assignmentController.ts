import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AIAssignmentService from '../services/ai/aiAssignmentServices';
import Assignment from '../models/Assignment';

export class AIController {
  private aiAssignmentService: AIAssignmentService;

  constructor() {
    this.aiAssignmentService = new AIAssignmentService();
  }

  public generateContent = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const result = await this.aiAssignmentService.generateAssignmentContent(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  public addAssignment = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const {
        assignmentType,
        subType,
        title,
        course,
        dueDate,
        description,
        learningObjectives,
        totalPoints,
        responseInstructions,
      } = req.body;

      // Create a new assignment with the data from request body
      const newAssignment = new Assignment({
        assignmentType,
        subType,
        title,
        course,
        dueDate,
        description,
        learningObjectives,
        totalPoints,
        responseInstructions,
        submission: [], // Empty initial submissions
      });

      // Save the new assignment to the database
      await newAssignment.save();

      res.status(201).json({
        success: true,
        message: 'Assignment created successfully',
        assignment: newAssignment,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  };

  // Edit an existing assignment
  public editAssignment = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    try {
      const { id } = req.params; // Get the assignment ID from the URL params
      const updateData = req.body; // Get the updated data from the request body

      const updatedAssignment = await Assignment.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedAssignment) {
        res.status(404).json({ success: false, message: 'Assignment not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Assignment updated successfully',
        assignment: updatedAssignment,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
