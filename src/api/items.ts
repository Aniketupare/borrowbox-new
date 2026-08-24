import { apiClient } from './apiClient';
import type { IItem } from '../types/Item';

export const getItems = async (params?: any): Promise<IItem[]> => {
  const { data } = await apiClient.get('/items', { params });
  return data;
};

export const getItemById = async (id: string): Promise<IItem> => {
  const { data } = await apiClient.get(`/items/${id}`);
  return data;
};

export const createItem = async (itemData: any): Promise<IItem> => {
  const { data } = await apiClient.post('/items', itemData);
  return data;
};

export const updateItem = async (id: string, itemData: any): Promise<IItem> => {
  const { data } = await apiClient.put(`/items/${id}`, itemData);
  return data;
};

export const deleteItem = async (id: string): Promise<void> => {
  await apiClient.delete(`/items/${id}`);
};

export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};
