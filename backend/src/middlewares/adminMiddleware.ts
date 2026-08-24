import { Request, Response, NextFunction } from 'express';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Assuming 'user' is populated in protect middleware and it has a role property
  // Since we haven't implemented role check in protect, we need to fetch user
  // For now, assume a simple role check if we add it to the user request object
  if ((req as any).userRole !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
