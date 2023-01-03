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
import Logger from './../../core/utils/logger';
import IMessage from './../../core/interfaces/message.interface';
import { IRefreshToken } from './../../core/interfaces/refresh_token.interface';
import ILocationIpAddress from './../../core/interfaces/location.interface';
import p from 'phin';

const userSchema = UserSchema;

class AuthService {
  public login = async (model: LoginDto, ip: string): Promise<TokenData> => {
    if (isEmptyObject(model)) {
      throw new HttpException(400, 'Model is empty');
    }
    const user = await userSchema.findOne({ email: model.email }).exec();
    if (!user) {
      throw new HttpException(409, `Your email ${model.email} is not exist.`);
    }
    const isMatchPassword = await bcryptjs.compare(model.password, user.password);
    if (!isMatchPassword) throw new HttpException(400, 'Credential is not valid');

    const refreshToken = await this.generateRefreshToken(user._id, ip);
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

  public async refreshToken(token: string, ip: string): Promise<TokenData> {
    const refreshToken = await this.getRefreshTokenFromDb(token, ip);
    const { user } = refreshToken;

    const userId = user.valueOf();

    // replace old refresh token with a new one and save
    const newRefreshToken = await this.generateRefreshToken(userId, ip);
    refreshToken.revoked = new Date(Date.now());
    refreshToken.replacedByToken = newRefreshToken.token;
    await refreshToken.save();
    await newRefreshToken.save();

    return generateJwtToken(userId, newRefreshToken.token);
  }

  public async revokeToken(token: string): Promise<IMessage> {
    const refreshToken = await this.getRefreshTokenFromDb(token);
    // revoke token and save
    refreshToken.revoked = new Date(Date.now());
    await refreshToken.save();
    return { message: 'Success revoke token'};
  }

  private async getRefreshTokenFromDb(refreshToken: string, ip?: string) {
    const token = await RefreshTokenSchema.findOne({ token: refreshToken }).populate('user').exec();
    
    if (!token) throw new HttpException(400, `Invalid refresh token`);
    if(!token.revoked && ip != null && token.createdByIp != ip) {

      const url = `http://api.ipstack.com/${ip}?access_key=b15d53eb0f63b5a549a7b1833c2e0841`;
      const res = await p({
        url: url,
        method: 'GET',
        parse: 'json'
      });

      const body: ILocationIpAddress = res.body as ILocationIpAddress;

      var userEmail = token.user.toString().split('\n')[4].split('\'')[1];
      console.log(`Tài khoản của bạn: ${userEmail} vừa đăng nhập trên một thiết bị mới: ${body.ip} tại ${body.city}, ${body.region_name}, ${body.country_name}. Nếu không phải bạn, hãy thay đổi mật khẩu ngay lập tức`);

    }
    if(!token.isActive) { //RFR detect hacker attacking the session
      //dispute refresh token session in hacker-user 
      if(token.revoked) {
        await this.revokeToken(token.replacedByToken);
      }
      throw new HttpException(401, `Session invalid`); 
    }
    return token;
  }

  private generateRefreshToken = async (userId: string, ip: string): Promise<any> => {
    // create a refresh token that expires in 7 days
    return new RefreshTokenSchema({
      user: userId,
      token: randomTokenString(),
      createdByIp: ip,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // in 7 days
    });
  };
}

export default new AuthService();
