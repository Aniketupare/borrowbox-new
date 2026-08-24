import { apiClient } from './apiClient';

export interface IAdminStats {
  userCount: number;
  itemCount: number;
  bookingCount: number;
}

export interface IAdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const getAdminStats = async (): Promise<IAdminStats> => {
  const { data } = await apiClient.get('/admin/stats');
  return data;
};

export const getAdminUsers = async (): Promise<IAdminUser[]> => {
  const { data } = await apiClient.get('/admin/users');
  return data;
};
