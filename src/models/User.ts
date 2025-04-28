import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  plan: 'educator' | 'department' | 'institution'; // 🆕 new field
  billingCycle: 'monthly' | 'yearly'; // 🆕 new field
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    plan: {
      type: String,
      enum: ['educator', 'department', 'institution'],
      default: 'educator',
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'yearly',
    },
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;
