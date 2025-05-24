import apiClient from './apiClient';
import type { AuthResponse, SigninData, SignupData, User } from '../types';

export const authService = {
  signup: async (data: SignupData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/users/signup', data);
  },

  signin: async (data: SigninData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/users/signin', data);
  },

  getMe: async (): Promise<User> => {
    return apiClient.get<User>('/users/me');
  }
};
