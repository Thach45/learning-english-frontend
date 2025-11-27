import apiClient from './api';

export const achievementApi = {
  getUserAchievements: async () => {
    const response = await apiClient.get('/achievements/me');
    console.log("response", response.data.data);
    return response.data.data;
  },
  getUserInProgressAchievements: async () => {
    // CHỈ lấy achievements, KHÔNG check
    const response = await apiClient.get('/achievements/me/in-progress');
    console.log("response", response.data.data);
    return response.data.data;
  },
  // API riêng để check achievements (chỉ gọi khi cần)
  checkAchievements: async () => {
    const response = await apiClient.post('/achievements/check');
    return response.data.data;
  }
};