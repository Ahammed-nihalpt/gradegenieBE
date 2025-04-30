import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { IGradingResponse, IGradingResult } from './interface/IGradingResult';

const getPrompt = (
  className: string,
  type: string,
  rubric: string,
  studentAnswer: string
): string => {
  return `
  You are a university-level ${className} ${type} grader. Grade the student's answer using the rubric provided below. Base your evaluation only on the rubric — there is no reference answer.
  
  # Essay Rubric
  ## Categories:
  ${rubric}
  
  If you are unable to generate a valid JSON response for any reason (e.g., the rubric is malformed, the answer is unintelligible, or required categories are missing), return an error message in the following format:
  
  "ERROR: <short description of what went wrong>"
  
  Examples:
  - "ERROR: Missing required rubric categories"
  - "ERROR: Student answer is too short to evaluate"
  - "ERROR: Rubric format is invalid"
  
  Do not return anything else in that case.
  
  Otherwise, return your response in valid JSON format only.
  
  # JSON format:
  {
    "totalScore": number,
    "gradeLetter": string,
    "confidence": string, // "High", "Low", "Medium"
    "subScores": {
      "contentUnderstanding": {
        "score": number,
        "feedback": string
      },
      "analysisCriticalThinking": {
        "score": number,
        "feedback": string
      },
      "organizationStructure": {
        "score": number,
        "feedback": string
      },
      "writingQuality": {
        "score": number,
        "feedback": string
      }
    },
    "aiContentDetection": {
      "humanWrittenScore": number,
      "detailedAnalysis": {
        "introduction": {
          "aiProbability": number,
          "humanProbability": number
        },
        "mainBody": {
          "aiProbability": number,
          "humanProbability": number
        },
        "conclusion": {
          "aiProbability": number,
          "humanProbability": number
        }
      }
    },
    "feedback": {
      "strengths": string,
      "areasforImprovement": string,
      "actionItems": string
    },
    "plagiarismCheck": {
      "originalityScore": number,
      "matchedContent": {
        "sentence": string,
        "source": string,
        "matchScore": number
      }
    }
  }
  
  # Student Answer:
  """${studentAnswer}"""
  `.trim();
};

const cleanJSON = (text: string): string => {
  // Remove Markdown code block wrappers
  return text
    .trim()
    .replace(/^```json/, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();
};

const grading = async (
  className: string,
  type: string,
  rubric: string,
  studentAnswer: string
): Promise<IGradingResponse> => {
  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      prompt: getPrompt(className, type, rubric, studentAnswer),
    });

    const output = cleanJSON(text);

    if (output.startsWith('ERROR:')) {
      // Handle or throw an error with explanation
      const errorReason = output.replace('ERROR:', '').trim();
      return { error: true, message: errorReason, json: null };
    }

    // Otherwise parse and return valid result
    return {
      error: false,
      message: '',
      json: JSON.parse(output) as IGradingResult,
    };
  } catch (error) {
    console.error('Grading failed:', error);

    // Optionally return a fallback result structure or rethrow
    throw error;
  }
};

export default grading;
