import { Schema, model, Document, Types } from 'mongoose';

// Interface for Teacher
interface ITeacher extends Document {
  email: string;
  class: string;
  userId: Types.ObjectId;
}

// Schema for Teacher
const teacherSchema = new Schema<ITeacher>(
  {
    email: { type: String, required: true, unique: true },
    class: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Model
const Teacher = model<ITeacher>('Teacher', teacherSchema);

export default Teacher;
