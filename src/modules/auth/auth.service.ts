import LoginDto from './dtos/auth.dto';
import { TokenData } from '../../core/interfaces/auth.interface';
import { isEmptyObject, randomTokenString } from './../../core/utils/helper';
import { HttpException } from '../../core/exceptions';
import { UserSchema } from '../../modules/users';
import { generateJwtToken } from './../../core/utils/helper';
import { RefreshTokenSchema } from '../../modules/refresh_token';
import IPublicUserInfo from '@core/interfaces/public_user_info.interface';
import bcryptjs from 'bcryptjs';
import RoleEnum from './../../core/enums/role.enum';

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
  };

  public async getCurrentLoginUser(userId: string): Promise<IPublicUserInfo> {
    const user = await userSchema.findById(userId).exec();
    if (!user) {
      throw new HttpException(404, `User is not exists`);
    }

    const userRole = RoleEnum.ADMIN;

    let user_info = {
      _id: user._id,
      last_name: user.last_name,
      first_name: user.first_name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
      role: userRole
    } as IPublicUserInfo;

    return user_info;
  }

  public async refreshToken(token: string): Promise<TokenData> {
    const refreshToken = await this.getRefreshTokenFromDb(token);
    const { user } = refreshToken;

    // replace old refresh token with a new one and save
    const newRefreshToken = await this.generateRefreshToken(user);
    refreshToken.revoked = new Date(Date.now());
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    // return basic details and tokens
    return generateJwtToken(user, newRefreshToken.token);
  }

  public async revokeToken(token: string): Promise<void> {
    const refreshToken = await this.getRefreshTokenFromDb(token);

    // revoke token and save
    refreshToken.revoked = new Date(Date.now());
    await refreshToken.save();
  }

  private async getRefreshTokenFromDb(refreshToken: string) {
    const token = await RefreshTokenSchema.findOne({ refreshToken }).populate('user').exec();
    if (!token || !token.isActive) throw new HttpException(404, `Invalid token`);
    return token;
  }

  private generateRefreshToken = async (userId: string): Promise<any> => {
    // create a refresh token that expires in 7 days
    return new RefreshTokenSchema({
      user: userId,
      token: randomTokenString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // in 7 days
    });
  };
}

export = new AuthService();
