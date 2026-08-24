import { apiClient } from './apiClient';

export interface IReview {
  _id: string;
  reviewer: { _id: string; name: string };
  reviewee: { _id: string; name: string };
  item: string;
  booking: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const getReviewsByItem = async (itemId: string): Promise<IReview[]> => {
  const { data } = await apiClient.get(`/reviews/item/${itemId}`);
  return data;
};

export const createReview = async (data: { item: string; booking: string; rating: number; comment: string }): Promise<IReview> => {
  const response = await apiClient.post('/reviews', data);
  return response.data;
};
