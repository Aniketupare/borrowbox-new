import { apiClient } from './apiClient';

export interface IBorrowRequest {
  _id: string;
  item: { _id: string; title: string };
  borrower: { _id: string; name: string };
  owner: { _id: string; name: string };
  startDate: string;
  endDate: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt?: string;
}

export const getBorrowRequests = async (): Promise<IBorrowRequest[]> => {
  const { data } = await apiClient.get('/borrow-requests');
  return data;
};

export const createBorrowRequest = async (data: { item: string; startDate: string; endDate: string; message: string }): Promise<IBorrowRequest> => {
  const response = await apiClient.post('/borrow-requests', data);
  return response.data;
};

export const approveRequest = async (id: string): Promise<IBorrowRequest> => {
  const { data } = await apiClient.put(`/borrow-requests/${id}/approve`);
  return data;
};

export const rejectRequest = async (id: string): Promise<IBorrowRequest> => {
  const { data } = await apiClient.put(`/borrow-requests/${id}/reject`);
  return data;
};

export const cancelRequest = async (id: string): Promise<IBorrowRequest> => {
  const { data } = await apiClient.put(`/borrow-requests/${id}/cancel`);
  return data;
};
