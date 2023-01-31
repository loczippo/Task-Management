import { Request, Response, NextFunction } from 'express';
import { TokenData } from '@modules/auth';
import RegisterDto from '@modules/users/dtos/register.dto';

import UserService from './user.service';

class UserController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: RegisterDto = req.body;
      const TokenData: TokenData = await UserService.createUser(model);
      res.status(201).json(TokenData);
    } catch (error) {
      next(error);
    } finally {
    }
  };
}

export default new UserController();
