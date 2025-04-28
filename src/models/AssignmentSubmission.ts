import { Schema, model, Document } from 'mongoose';

interface InlineComment {
  id: string;
  startIndex: number;
  endIndex: number;
  text: string;
  color: string;
  timestamp: string;
  author: string;
  isAIGenerated?: boolean;
}
interface AICheckerResults {
  score: number;
  confidence: 'High' | 'Medium' | 'Low'; // stricter typing
  details: {
    section: string;
    aiProbability: number;
    humanProbability: number;
  }[];
}

interface SubScore {
  name: string;
  score: number;
  maxScore: number;
  rationale: string;
}

interface OverallFeedback {
  strengths: string;
  improvements: string;
  actionItems: string;
}

interface ISubmission extends Document {
  assignmentId?: Schema.Types.ObjectId;
  studentId?: Schema.Types.ObjectId;
  studentName?: string;
  fileName?: string;
  fileUrl?: string[];
  score?: number;
  content?: string;
  aiCheckerResults?: AICheckerResults[];
  comments?: {
    strengths?: string;
    improvementAreas?: string;
    actionItems?: string;
    subScores?: {
      analyticalArgument?: number;
      engagementWithText?: number;
      useLiteraryDevices?: number;
      academicWriting?: number;
    };
    justification?: string;
  };
  inlineComments?: InlineComment[]; // Added field for inline comments
  subScores?: SubScore[]; // Added field for sub-scores
  overallFeedback?: OverallFeedback; // Added field for overall feedback
  status?: 'Graded' | 'Pending' | 'In Progress';
  submissionTime?: string;
  integrityCheck?: {
    status?: 'Clear' | 'Flagged' | 'Checking...' | 'Not Run';
    aiDetection?: {
      score?: number;
      confidence?: 'High' | 'Medium' | 'Low';
      flaggedPhrases?: string[];
    };
    plagiarism?: {
      matchPercentage?: number;
      sources?: Array<{
        url?: string;
        matchPercentage?: number;
        title?: string;
      }>;
    };
  };
}

const submissionSchema = new Schema<ISubmission>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    studentName: { type: String },
    fileName: { type: String },
    fileUrl: { type: [String] },
    score: { type: Number },
    content: { type: String },
    aiCheckerResults: {
      score: { type: Number },
      confidence: ['High', 'Medium', 'Low'],
      details: [
        {
          section: { type: String },
          aiProbability: { type: Number },
          humanProbability: { type: Number },
        },
      ],
    }, // <-- added aiCheckerResults here
    comments: {
      strengths: { type: String },
      improvementAreas: { type: String },
      actionItems: { type: String },
      subScores: {
        analyticalArgument: { type: Number },
        engagementWithText: { type: Number },
        useLiteraryDevices: { type: Number },
        academicWriting: { type: Number },
      },
      justification: { type: String },
    },
    inlineComments: [
      {
        id: { type: String },
        startIndex: { type: Number },
        endIndex: { type: Number },
        text: { type: String },
        color: { type: String },
        timestamp: { type: String },
        author: { type: String },
        isAIGenerated: { type: Boolean, default: false },
      },
    ],
    subScores: [
      {
        name: { type: String },
        score: { type: Number },
        maxScore: { type: Number },
        rationale: { type: String },
      },
    ],
    overallFeedback: {
      strengths: { type: String },
      improvements: { type: String },
      actionItems: { type: String },
    },
    status: {
      type: String,
      enum: ['Graded', 'Pending', 'In Progress'],
      default: 'Pending',
    },
    submissionTime: { type: String },
    integrityCheck: {
      status: {
        type: String,
        enum: ['Clear', 'Flagged', 'Checking...', 'Not Run'],
        default: 'Not Run',
      },
      aiDetection: {
        score: { type: Number },
        confidence: { type: String, enum: ['High', 'Medium', 'Low'] },
        flaggedPhrases: [{ type: String }],
      },
      plagiarism: {
        matchPercentage: { type: Number },
        sources: [
          {
            url: { type: String },
            matchPercentage: { type: Number },
            title: { type: String },
          },
        ],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Submission = model<ISubmission>('Submission', submissionSchema);

export default Submission;
