import apiClient from './apiClient';
import type { Folder } from '../types';

export const folderService = {
  createFolder: async (data: { name: string; parentId?: string }): Promise<Folder> => {
    return apiClient.post<Folder>('/folders', data);
  },

  getFolders: async (): Promise<Folder[]> => {
    const response = await apiClient.get<{folders: Folder[]}>('/folders');
    return response.folders || [];
  },

  getFolder: async (id: string): Promise<Folder> => {
    return apiClient.get<Folder>(`/folders/${id}`);
  },

  updateFolder: async (id: string, data: { name: string }): Promise<Folder> => {
    return apiClient.put<Folder>(`/folders/${id}`, data);
  },

  deleteFolder: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/folders/${id}`);
  }
};
