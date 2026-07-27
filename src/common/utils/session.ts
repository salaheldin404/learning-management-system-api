import { Response } from 'express';
import env from '@/config/env';
import ms from "ms";
import { generateTokens } from './jwt';

export function setSession(res: Response, userId: string) {
  const { token, refreshToken } = generateTokens(userId);

  const cookieOptions = (maxAge: number) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge
  });

  const accessMaxAge = ms(env.JWT_EXPIRES_IN);
  const refreshMaxAge = ms(env.JWT_REFRESH_EXPIRES_IN);

  res.cookie('token', token, cookieOptions(accessMaxAge));
  res.cookie('refreshToken', refreshToken, cookieOptions(refreshMaxAge));

  return token

}

export function clearSession(res: Response) {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
}
