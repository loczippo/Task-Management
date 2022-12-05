
import LoginDto from './dtos/auth.dto';
import { TokenData } from '../../core/interfaces/auth.interface';
import { isEmptyObject, randomTokenString } from './../../core/utils/helper';
import { HttpException } from '../../core/exceptions';
import { UserSchema } from '../../modules/users';
import { generateJwtToken } from './../../core/utils/helper';
import { RefreshTokenSchema } from '../../modules/refresh_token';
import bcryptjs from 'bcryptjs';

const userSchema = UserSchema;

class AuthService {
    public login = async (model: LoginDto): Promise<TokenData> => {
        if (isEmptyObject(model)) {
            throw new HttpException(400, 'Model is empty');
        }
        const user = await userSchema.findOne({ email: model.email }).exec();
        if (!user) {
        throw new HttpException(409, `Your email ${model.email} is not exist.`);
        }
        const isMatchPassword = await bcryptjs.compare(model.password, user.password);
        if (!isMatchPassword) throw new HttpException(400, 'Credential is not valid');

        const refreshToken = await this.generateRefreshToken(user._id);
        const jwtToken = generateJwtToken(user._id, refreshToken.token);

        // save refresh token
        await refreshToken.save();

        return jwtToken;
    }
    

    private generateRefreshToken = async(userId: string): Promise<any> => {
        // create a refresh token that expires in 7 days
        return new RefreshTokenSchema({
          user: userId,
          token: randomTokenString(),
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // in 7 days
        });
      }
}

export = new AuthService;