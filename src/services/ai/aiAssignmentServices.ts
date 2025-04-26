import aiModel from './aiModel';

interface GenerateRequestBody {
  assignmentType: string;
  subType: string[];
  title: string;
  course: string;
  dueDate?: string;
  description: string;
  learningObjectives?: string;
}

export default class AIAssignmentService {
  public async generateAssignmentContent(
    body: GenerateRequestBody,
  ): Promise<Record<string, string>> {
    const { assignmentType, subType, title, course, description, learningObjectives, dueDate } =
      body;

    const prompts = this.buildPrompts(
      assignmentType,
      subType,
      title,
      course,
      description,
      learningObjectives,
      dueDate,
    );

    const results: Record<string, string> = {};

    try {
      const requests = Object.entries(prompts).map(async ([section, prompt]) => {
        const result = await aiModel.generateContent(prompt);
        const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

        return {
          section,
          content: text ?? '',
        };
      });

      const responses = await Promise.all(requests);

      responses.forEach(({ section, content }) => {
        results[section] = this.cleanAIOutput(content);
      });
    } catch (error) {
      console.error('Error generating assignment content:', error);
      throw new Error('Failed to generate assignment content.');
    }

    return results;
  }

  private cleanAIOutput(output: string): string {
    const cutAfter =
      'Strictly follow Markdown formatting with headings (#, ##, ###), bullet points (-), bold (**) where needed. Do not add extra commentary.';

    const index = output.indexOf(cutAfter);
    if (index !== -1) {
      return output.slice(0, index + cutAfter.length);
    }
    return output.trim(); // fallback if no extra garbage
  }

  private buildPrompts(
    assignmentType: string,
    subType: string[],
    title: string,
    course: string,
    description: string,
    learningObjectives?: string,
    dueDate?: string,
  ): Record<string, string> {
    const prompts: Record<string, string> = {};

    const learningObjectivesSection = learningObjectives
      ? `### Learning Objectives\n${learningObjectives
          .split(',')
          .map((obj) => `- ${obj.trim()}`)
          .join('\n')}\n`
      : '';

    const baseInstruction = `Generate the content in strict Markdown format as below:

# ${assignmentType}: ${title}
## ${course}

### Overview
Provide a short paragraph summarizing what this assignment is about based on this description: '${description}'.

${learningObjectivesSection}### Requirements
- Length: 1000-1500 words
- Format: Clear, organized structure with proper grammar and spelling
${dueDate ? `- Due Date: ${dueDate}` : ''}

### Components
Your assignment should include:

1. **Introduction**
    - Clear thesis or main argument
    - Overview of the topic's significance
    - Brief outline of your approach

2. **Main Body**
    - Well-structured arguments with supporting evidence
    - Critical analysis of key concepts
    - Application of relevant theories

3. **Conclusion**
    - Summary of key points
    - Implications of your analysis
    - Suggestions for further consideration

### Submission Guidelines
Explain clearly how and where students should submit it.

Strictly follow Markdown formatting with headings (#, ##, ###), bullet points (-), bold (**) where needed. Do not add extra commentary.`;

    subType.forEach((type) => {
      switch (type) {
        case 'instructions':
          prompts.instructions = `Write assignment instructions based on this:\n${baseInstruction}`;
          break;
        case 'rubric':
          prompts.rubric = `Create a grading rubric for the assignment '${title}' in '${course}'. Format it properly in Markdown. Include criteria like Content, Organization, Analysis, Language Use, each scored separately.`;
          break;
        default:
          break;
      }
    });

    return prompts;
  }
}
