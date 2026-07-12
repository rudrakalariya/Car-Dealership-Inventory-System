import jwt, { SignOptions } from 'jsonwebtoken';

/* istanbul ignore next */
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretfallback';

export const generateToken = (
  payload: object,
  expiresIn: SignOptions['expiresIn'] = '24h'
): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET);
};
