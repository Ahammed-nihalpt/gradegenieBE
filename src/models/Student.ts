import { Schema, model, Document, Types } from 'mongoose';

// Interface for Student
interface IStudent extends Document {
  name: string;
  email: string;
  class: string;
  userId: Types.ObjectId;
}

// Schema for Student
const studentSchema = new Schema<IStudent>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    class: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

// Model
const Student = model<IStudent>('Student', studentSchema);

export default Student;
