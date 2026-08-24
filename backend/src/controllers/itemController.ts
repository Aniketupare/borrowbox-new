import { Request, Response } from 'express';
import * as itemService from '../services/itemService';
import { itemSchema } from '../utils/itemValidation';

export const createItem = async (req: Request, res: Response) => {
  try {
    const validatedData = itemSchema.parse(req.body);
    const item = await itemService.createItem((req as any).user, validatedData);
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await itemService.getItems(req.query);
    res.status(200).json(items);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const validatedData = itemSchema.parse(req.body);
    const item = await itemService.updateItem(req.params.id, (req as any).user, validatedData);
    res.status(200).json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    await itemService.deleteItem(req.params.id, (req as any).user);
    res.status(200).json({ message: 'Item deleted' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
