import { Request,  } from 'express';
import rateLimit from 'express-rate-limit';

export const perSecondLimiter = rateLimit({
  windowMs: 1000,
  max: 1,
  message: 'Too many requests from this user for this item per second, please try again later.',
  keyGenerator: (req: Request) => {
    const userId = req.header('X-User-ID');
    const itemId = req.body.item_id;
    if (userId && itemId) {
      return `${userId}_${itemId}_perSecond`;
    }
    return 'common';
  }
});

export const perTenSecondsLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 5,
  message: 'Too many requests from this user for this item per ten seconds, please try again later.',
  keyGenerator: (req: Request) => {
    const userId = req.header('X-User-ID');
    const itemId = req.body.item_id;
    if (userId && itemId) {
      return `${userId}_${itemId}_perTenSeconds`;
    }
    return 'common';
  }
});

export const perMinuteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Too many requests from this user for this item per minute, please try again later.',
  keyGenerator: (req: Request) => {
    const userId = req.header('X-User-ID');
    const itemId = req.body.item_id;
    if (userId && itemId) {
      return `${userId}_${itemId}_perMinute`;
    }
    return 'common';
  }
});