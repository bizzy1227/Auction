import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';

export async function checkUserIdHeader(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.header('X-User-ID');

  const user = await User.findByPk(userId)

  if (!userId) {
    res.status(400).json({ message: 'X-User-ID header is missing' });
    return;
  }

  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }

  next();
}
