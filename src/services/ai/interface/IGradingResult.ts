export interface IGradingResult {
  totalScore: number;
  gradeLetter: string;
  confidence: string;
  subScores: {
    contentUnderstanding: {
      score: number;
      feedback: string;
    };
    analysisCriticalThinking: {
      score: number;
      feedback: string;
    };
    organizationStructure: {
      score: number;
      feedback: string;
    };
    writingQuality: {
      score: number;
      feedback: string;
    };
  };
  aiContentDetection: {
    humanWrittenScore: number;
    detailedAnalysis: {
      introduction: {
        aiProbability: number;
        humanProbability: number;
      };
      mainBody: {
        aiProbability: number;
        humanProbability: number;
      };
      conclusion: {
        aiProbability: number;
        humanProbability: number;
      };
    };
  };
  feedback: {
    strengths: string;
    areasforImprovement: string;
    actionItems: string;
  };
  plagiarismCheck: {
    originalityScore: number;
    matchedContent: {
      sentence: string;
      source: string;
      matchScore: number;
    };
  };
}

export interface IGradingResponse {
  error: boolean;
  message: string;
  json: IGradingResult | null;
}
