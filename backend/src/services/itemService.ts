import { Item, IItem } from '../models/Item';
import { Types } from 'mongoose';

export const createItem = async (userId: string, data: any) => {
  return await Item.create({ ...data, owner: userId, location: { type: 'Point', coordinates: data.location.coordinates } });
};

export const getItems = async (filters: any) => {
  const query: any = {};
  if (filters.category) query.category = filters.category;
  if (filters.condition) query.condition = filters.condition;
  if (filters.minPrice) query.borrowingFee = { ...query.borrowingFee, $gte: filters.minPrice };
  if (filters.maxPrice) query.borrowingFee = { ...query.borrowingFee, $lte: filters.maxPrice };
  
  if (filters.lat && filters.lng && filters.maxDistance) {
    query.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [parseFloat(filters.lng), parseFloat(filters.lat)] },
        $maxDistance: parseInt(filters.maxDistance)
      }
    };
  }
  return await Item.find(query);
};

export const getItemById = async (id: string) => {
  return await Item.findById(id).populate('owner', 'name email');
};

export const updateItem = async (id: string, userId: string, data: any) => {
  const item = await Item.findOne({ _id: id, owner: userId });
  if (!item) throw new Error('Item not found or not authorized');
  if (item.status === 'Borrowed' && data.status && data.status !== 'Borrowed') {
    throw new Error('Cannot change status of an actively borrowed item');
  }
  if (data.location) {
    data.location.type = 'Point';
  }
  Object.assign(item, data);
  return await item.save();
};

export const deleteItem = async (id: string, userId: string) => {
  const item = await Item.findOne({ _id: id, owner: userId });
  if (!item) throw new Error('Item not found or not authorized');
  if (item.status === 'Borrowed') {
    throw new Error('Cannot delete an actively borrowed item');
  }
  return await Item.findByIdAndDelete(id);
};
