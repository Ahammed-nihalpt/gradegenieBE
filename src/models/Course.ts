import { Document, model, Schema, Types } from 'mongoose';

interface IRequiredMaterial {
  title: string;
  author: string;
  publisher: string;
  year: number;
  required: boolean;
}

interface IGradingPolicy {
  description: string;
  percentage: number;
}

interface IWeeklySchedule {
  week: number;
  topic: string;
  readings: string;
  assignment: string;
}

interface ICoursePolicy {
  policyName: string;
  description: string;
}

interface ISyllabus {
  learningObjectives: string[];
  requiredMaterials: IRequiredMaterial[];
  gradingPolicy: IGradingPolicy[];
  weeklySchedule: IWeeklySchedule[];
  coursePolicies: ICoursePolicy[];
}

export interface ICourse extends Document {
  name: string;
  subject: string;
  gradeLevel: string;
  description: string;
  instructorName: string;
  isDraft: boolean;
  currentStep: number;
  code: number;
  syllabusmd: string;
  syllabus: ISyllabus;
  userId: Types.ObjectId;
}
const courseSchema = new Schema<ICourse>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    subject: { type: String, required: false },
    gradeLevel: { type: String, required: false },
    description: { type: String, required: true },
    code: { type: Number },
    instructorName: { type: String, required: false },
    syllabusmd: { type: String, required: false },
    isDraft: { type: Boolean, default: false }, // <-- Added
    currentStep: { type: Number, default: 1 }, // <-- Added
    syllabus: {
      instructor: { type: String, required: false },
      term: { type: String, required: false },
      learningObjectives: [{ type: String, required: false }],
      requiredMaterials: [
        {
          title: { type: String, required: false },
          author: { type: String, required: false },
          publisher: { type: String, required: false },
          year: { type: Number, required: false },
          required: { type: Boolean, default: false },
        },
      ],
      gradingPolicy: [
        {
          name: { type: String, required: false },
          description: { type: String, required: false },
          percentage: { type: Number, required: false },
        },
      ],
      weeklySchedule: [
        {
          week: { type: Number, required: false },
          topic: { type: String, required: false },
          readings: { type: String, required: false },
          assignment: { type: String, required: false },
        },
      ],
      coursePolicies: [
        {
          policyName: { type: String, required: false },
          description: { type: String, required: false },
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals when document is converted to JSON
    toObject: { virtuals: true },
  }
);

courseSchema.virtual('assignments', {
  ref: 'Assignment',
  localField: '_id',
  foreignField: 'courseId',
});
const Course = model<ICourse>('Course', courseSchema);

export default Course;
