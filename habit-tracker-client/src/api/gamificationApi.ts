import apiClient from './client';
import { GamificationProfile, Achievement } from '../types';

export const gamificationApi = {
  getProfile: async (): Promise<GamificationProfile> => {
    const response = await apiClient.get('/gamification/profile');
    return response.data;
  },

  getAchievements: async (): Promise<Achievement[]> => {
    const response = await apiClient.get('/gamification/achievements');
    return response.data;
  },

  checkAchievements: async (): Promise<void> => {
    await apiClient.post('/gamification/achievements/check');
  },
};
