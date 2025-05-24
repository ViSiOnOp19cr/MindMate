import axios from 'axios';
import apiClient from './apiClient';
import type { FileInfo } from '../types';

export const fileUploadService = {
  uploadFile: async (file: File): Promise<FileInfo> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      'http://localhost:3000/api/upload',
      formData,
      apiClient.getUploadConfig()
    );
    
    return response.data;
  },

  getFileInfo: async (filename: string): Promise<FileInfo> => {
    return apiClient.get<FileInfo>(`/upload/${filename}`);
  },

  deleteFile: async (filename: string): Promise<void> => {
    return apiClient.delete<void>(`/upload/${filename}`);
  }
};
