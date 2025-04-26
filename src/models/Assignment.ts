import { Schema, model, Document } from 'mongoose';

interface IAssignment extends Document {
  assignmentType: string;
  subType: string[];
  title: string;
  course: string;
  dueDate?: string;
  description: string;
  learningObjectives?: string;
  totalPoints: number;
  responseInstructions: string; // <-- added responseInstructions
}

const assignmentSchema = new Schema<IAssignment>(
  {
    assignmentType: { type: String, required: true },
    subType: { type: [String], required: true },
    title: { type: String, required: true },
    course: { type: String, required: true },
    dueDate: { type: String },
    description: { type: String, required: true },
    learningObjectives: { type: String },
    totalPoints: { type: Number, required: true },
    responseInstructions: { type: String, required: true },
  },
  { timestamps: true },
);

const Assignment = model<IAssignment>('Assignment', assignmentSchema);

export default Assignment;
