import apiClient from './apiClient';
import type { Quiz, Summary } from '../types';

export const aiService = {
  generateSummary: async (noteId: string): Promise<Summary> => {
    const response = await apiClient.post<{summary: Summary}>('/ai/summary', { noteId });
    return response.summary;
  },

  generateQuiz: async (noteId: string): Promise<Quiz> => {
    const response = await apiClient.post<{quiz: Quiz}>('/ai/quiz', { noteId });
    return response.quiz;
  },

  chatWithAI: async (message: string): Promise<{ response: string }> => {
    const response = await apiClient.post<{ response: string }>('/ai/chat', { message });
    return response;
  },

  getSummaries: async (): Promise<Summary[]> => {
    const response = await apiClient.get<{summaries: Summary[]}>('/ai/summaries');
    return response.summaries || [];
  },

  getQuizzes: async (): Promise<Quiz[]> => {
    const response = await apiClient.get<{quizzes: Quiz[]}>('/ai/quizzes');
    return response.quizzes || [];
  },

  deleteSummary: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/ai/summary/${id}`);
  },

  deleteQuiz: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/ai/quiz/${id}`);
  }
};
