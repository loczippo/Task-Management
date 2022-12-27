import { Request, Response, NextFunction } from 'express';
import LoginDto from './dtos/auth.dto';
import { TokenData } from '../../core/interfaces/auth.interface';
import authService from './auth.service';
class AuthController {
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginDto = req.body;
      const tokenData: TokenData = await authService.login(model);
      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    } finally {
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body.refreshToken;
      const tokenData: TokenData = await authService.refreshToken(refreshToken);
      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  public revokeToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.body.token;
      await authService.revokeToken(token);
      res.status(200);
    } catch (error) {
      next(error);
    }
  };

  public getCurrentLoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.getCurrentLoginUser(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
