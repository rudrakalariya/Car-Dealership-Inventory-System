import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenGenerator';

import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: jwt.JwtPayload & { role?: string; id?: number; username?: string };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded as jwt.JwtPayload & { role?: string; id?: number; username?: string };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      return;
    }
    next();
  };
};

export const authenticateCustomer = authorizeRole(['customer']);
export const authenticateAdmin = authorizeRole(['admin']);
