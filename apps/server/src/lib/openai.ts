import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateSummaryWithAI = async (content: string, title?: string): Promise<string> => {
  try {
    const prompt = `Please provide a concise summary of the following note${title ? ` titled "${title}"` : ''}:

${content}

Summary:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates concise, informative summaries of study notes. Focus on the main concepts, key points, and important details."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate summary';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate summary with AI');
  }
};

export const generateQuizWithAI = async (content: string, title?: string): Promise<string> => {
  try {
    const prompt = `Based on the following note${title ? ` titled "${title}"` : ''}, create a quiz with 3-5 multiple choice questions. Each question should have 4 options (A, B, C, D) and include the correct answer and a brief explanation.

Note content:
${content}

Please format the response as a JSON object with the following structure:
{
  "title": "Quiz for [note title]",
  "questions": [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation of why this is correct"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates educational quizzes based on study notes. Always respond with valid JSON format. Focus on testing understanding of key concepts."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Validate JSON format
    try {
      JSON.parse(response);
      return response;
    } catch (parseError) {
      console.error('Invalid JSON response from OpenAI:', response);
      throw new Error('Invalid quiz format received from AI');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate quiz with AI');
  }
};

export const generateChatResponse = async (message: string, context?: string): Promise<string> => {
  try {
    const systemMessage = context 
      ? `You are a helpful AI study assistant. Use the following context to help answer questions: ${context}`
      : "You are a helpful AI study assistant. Help users with their study-related questions.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate response';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate chat response with AI');
  }
};