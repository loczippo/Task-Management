
import { Request, Response, NextFunction } from 'express';
import LoginDto from './dtos/auth.dto'
import { TokenData } from '../../core/interfaces/auth.interface';
import authService from './auth.service';
class AuthController {

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model: LoginDto = req.body;
            const tokenData: TokenData = await authService.login(model);
            res.status(200).json(tokenData);
        } catch(error) {
            next(error);
        } finally {

        }
    }
}

export default new AuthController();