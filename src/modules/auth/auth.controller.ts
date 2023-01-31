import { Request, Response, NextFunction } from 'express';
import LoginDto from './dtos/auth.dto';
import { TokenData } from '../../core/interfaces/auth.interface';
import authService from './auth.service';
class AuthController {
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model: LoginDto = req.body;

      const ip: string = req.ip;

      const tokenData: TokenData = await authService.login(model, ip);

      const isSecure = process.env.NODE_ENV != 'development';

      const isDomain = process.env.NODE_ENV == 'production' ? process.env.FE_URL?.replace(/^https?:\/\//, '') : 'localhost';

      //stored credentials cookie in client session

      res.cookie('user_token', tokenData.token, {
        maxAge: 1000* 60 * 60 *24 * 1,
        secure: isSecure,
        httpOnly: true,
        domain: isDomain
      });

      res.cookie('refresh_token', tokenData.refreshToken, {
        maxAge: 1000* 60 * 60 *24 * 365,
        secure: isSecure,
        httpOnly: true,
        domain: isDomain
      });

      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    } finally {
    }
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body.refreshToken;

      const ip: string = req.ip;

      const tokenData: TokenData = await authService.refreshToken(refreshToken, ip);
      res.status(200).json(tokenData);
    } catch (error) {
      next(error);
    }
  };

  public revokeToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.body.token;
      const revokeData = await authService.revokeToken(token);
      res.status(200).json(revokeData);
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
