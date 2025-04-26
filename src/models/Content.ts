import { Document, Schema, model } from 'mongoose';

interface IContent extends Document {
  userId: Schema.Types.ObjectId;
  prompt: string;
  output: string;
  files?: string[];
  createdAt: Date;
}

const ContentSchema = new Schema<IContent>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  prompt: { type: String, required: true },
  output: { type: String, required: true },
  files: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default model<IContent>('Content', ContentSchema);
