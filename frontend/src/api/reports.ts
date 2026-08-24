import { apiClient } from './apiClient';

export interface IDamageReport {
  _id: string;
  booking: string;
  type: string;
  description: string;
  estimatedCost: number;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
}

export interface IDispute {
  _id: string;
  damageReport: string;
  reason: string;
  description: string;
  status: 'OPEN' | 'RESOLVED';
  resolution?: string;
}

export const createDamageReport = async (data: { booking: string; type: string; description: string; estimatedCost: number }): Promise<IDamageReport> => {
  const { data: response } = await apiClient.post('/damage-reports', data);
  return response;
};

export const createDispute = async (data: { damageReport: string; reason: string; description: string }): Promise<IDispute> => {
  const { data: response } = await apiClient.post('/disputes', data);
  return response;
};
