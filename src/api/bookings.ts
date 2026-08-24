import { apiClient } from './apiClient';

export interface IBooking {
  _id: string;
  item: { _id: string; title: string; images: string[] };
  borrower: { _id: string; name: string };
  owner: { _id: string; name: string };
  startDate: string;
  endDate: string;
  status: 'CONFIRMED' | 'ACTIVE' | 'RETURNED' | 'CANCELLED' | 'DISPUTED';
}

export const getBookings = async (): Promise<IBooking[]> => {
  const { data } = await apiClient.get('/bookings');
  return data;
};

export const returnBooking = async (id: string): Promise<IBooking> => {
  const { data } = await apiClient.put(`/bookings/${id}/return`);
  return data;
};

export const cancelBooking = async (id: string): Promise<IBooking> => {
  const { data } = await apiClient.put(`/bookings/${id}/cancel`);
  return data;
};
