import { IGradingResult } from '../services/ai/interface/IGradingResult';

export const mapAiGradesToSubmission = (
  submissionData: any,
  aiGrades: IGradingResult
) => {
  submissionData.aiCheckerResults = {
    score: aiGrades.totalScore,
    confidence: aiGrades.confidence,
    details: [
      {
        section: 'Introduction',
        aiProbability:
          aiGrades.aiContentDetection.detailedAnalysis.introduction
            .aiProbability,
        humanProbability:
          aiGrades.aiContentDetection.detailedAnalysis.introduction
            .humanProbability,
      },
      {
        section: 'Main Body',
        aiProbability:
          aiGrades.aiContentDetection.detailedAnalysis.mainBody.aiProbability,
        humanProbability:
          aiGrades.aiContentDetection.detailedAnalysis.mainBody
            .humanProbability,
      },
      {
        section: 'Conclusion',
        aiProbability:
          aiGrades.aiContentDetection.detailedAnalysis.conclusion.aiProbability,
        humanProbability:
          aiGrades.aiContentDetection.detailedAnalysis.conclusion
            .humanProbability,
      },
    ],
  };

  submissionData.subScores = [
    {
      name: 'Content',
      score: aiGrades.subScores.contentUnderstanding.score,
      maxScore: 100,
      rationale: aiGrades.subScores.contentUnderstanding.feedback,
    },
    {
      name: 'Organization',
      score: aiGrades.subScores.organizationStructure.score,
      maxScore: 100,
      rationale: aiGrades.subScores.organizationStructure.feedback,
    },
    {
      name: 'Grammar',
      score: aiGrades.subScores.writingQuality.score,
      maxScore: 100,
      rationale: aiGrades.subScores.writingQuality.feedback,
    },
    {
      name: 'Citations',
      score: aiGrades.subScores.analysisCriticalThinking.score,
      maxScore: 100,
      rationale: aiGrades.subScores.analysisCriticalThinking.feedback,
    },
  ];

  submissionData.integrityCheck = {
    plagiarism: {
      originalityScore: aiGrades.plagiarismCheck.originalityScore,
      matchedContent: {
        sentence: aiGrades.plagiarismCheck.matchedContent.sentence,
        source: aiGrades.plagiarismCheck.matchedContent.source,
        matchScore: aiGrades.plagiarismCheck.matchedContent.matchScore,
      },
    },
  };

  submissionData.overallFeedback = {
    strengths: aiGrades.feedback.strengths,
    improvements: aiGrades.feedback.areasforImprovement,
    actionItems: aiGrades.feedback.actionItems,
  };

  return submissionData;
};
