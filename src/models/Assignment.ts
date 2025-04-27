import { Schema, model, Document, Types } from 'mongoose';

interface IAssignment extends Document {
  assignmentType: string;
  subType: string[];
  title: string;
  courseId: Types.ObjectId;
  dueDate?: string;
  description: string;
  learningObjectives?: string;
  totalPoints: number;
  responseInstructions: string;
  userId: Types.ObjectId;
  status?: string;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignmentType: { type: String, required: true },
    subType: { type: [String], required: true },
    title: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    dueDate: { type: String },
    description: { type: String, required: false },
    learningObjectives: { type: String },
    totalPoints: { type: Number, required: false },
    responseInstructions: { type: String, required: false },
    status: { type: String, default: 'draft' },
  },
  { timestamps: true },
);

// ⭐ Add virtual populate
assignmentSchema.virtual('submissions', {
  ref: 'Submission', // model to populate from
  localField: '_id', // Assignment _id
  foreignField: 'assignmentId', // Submission's assignmentId
});

// ⭐ Allow virtuals in JSON and Object outputs
assignmentSchema.set('toObject', { virtuals: true });
assignmentSchema.set('toJSON', { virtuals: true });

const Assignment = model<IAssignment>('Assignment', assignmentSchema);

export default Assignment;
