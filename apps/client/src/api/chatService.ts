import apiClient from './apiClient';
import type { ChatMessage } from '../types';

export const chatService = {
  createChatMessage: async (message: string, response: string): Promise<ChatMessage> => {
    const result = await apiClient.post<{chatHistory: ChatMessage}>('/chat', { message, response });
    return result.chatHistory;
  },

  getChatHistory: async (): Promise<ChatMessage[]> => {
    const response = await apiClient.get<{messages: ChatMessage[]}>('/chat');
    return response.messages || [];
  },

  deleteChatMessage: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/chat/${id}`);
  },

  clearChatHistory: async (): Promise<void> => {
    return apiClient.delete<void>('/chat');
  }
};
