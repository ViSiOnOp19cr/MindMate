import apiClient from './apiClient';
import type { Note } from '../types';

export const noteService = {
  createNote: async (data: { folderId: string; title?: string; content?: string }): Promise<Note> => {
    return apiClient.post<Note>('/notes', data);
  },

  getNotes: async (): Promise<Note[]> => {
    const response = await apiClient.get<{notes: Note[]}>('/notes');
    return response.notes || [];
  },

  getNote: async (id: string): Promise<Note> => {
    const response = await apiClient.get<{note: Note}>(`/notes/${id}`);
    return response.note;
  },

  updateNote: async (id: string, data: { title?: string; content?: string }): Promise<Note> => {
    return apiClient.put<Note>(`/notes/${id}`, data);
  },

  deleteNote: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/notes/${id}`);
  }
};
