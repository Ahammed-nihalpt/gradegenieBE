import { Schema, model, Document } from 'mongoose';

interface ISubmission extends Document {
  assignmentId: Schema.Types.ObjectId; // Reference to Assignment
  studentId: string;
  submittedAt: Date;
  fileUrl: string;
  grade?: number;
  status: 'submitted' | 'graded' | 'pending';
}

const submissionSchema = new Schema<ISubmission>({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  fileUrl: { type: String, required: true },
  grade: { type: Number },
  status: {
    type: String,
    enum: ['submitted', 'graded', 'pending'],
    default: 'pending',
    required: true,
  },
});

const Submission = model<ISubmission>('Submission', submissionSchema);

export default Submission;
