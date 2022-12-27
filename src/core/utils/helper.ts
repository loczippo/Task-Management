import { DataStoredInToken, TokenData } from '@core/interfaces/auth.interface';
import rateLimit from 'express-rate-limit';
import express, { Application } from 'express';

import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const isEmptyObject = (obj: any): boolean => {
  return !Object.keys(obj).length;
};

export const randomTokenString = (): string => {
  return crypto.randomBytes(40).toString('hex');
};

export const generateJwtToken = (userId: string, refreshToken: string): TokenData => {
  const dataInToken: DataStoredInToken = { id: userId };
  const secret: string = process.env.JWT_TOKEN_SECRET  || '';
  const expiresIn = 3600; //in seconds
  return {
    token: jwt.sign(dataInToken, secret, { expiresIn: expiresIn }),
    refreshToken: refreshToken,
  };
};
