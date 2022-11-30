import UserSchema from './user.model';
import RegisterDto from './dtos/register.dto';
import { TokenData } from '@core/interfaces/auth.interface';
import { isEmptyObject } from '../../core/utils';
import {HttpException} from '../../core/exceptions';
import { RefreshTokenSchema } from '../refresh_token';
import bcryptjs from 'bcryptjs';
import gravatar from 'gravatar';

import { randomTokenString, generateJwtToken } from '../../core/utils/helper';

let userSchema = UserSchema;

class UserSerice {
    public createUser = async(model: RegisterDto): Promise<TokenData> => {
        if(isEmptyObject(model)) {
            throw new HttpException(400, 'Model is empty')
        }
        const userIsValid = await userSchema.findOne({email: model.email}).exec();
        if(userIsValid) {
            throw new HttpException(409, `Email ${model.email} ready exist`);
        }
    
        const avatar = gravatar.url(model.email, {
            size: '200',
            rating: 'g',
            default: 'mm',
        });
    
        const salt = await bcryptjs.genSalt(10);
    
        const hashedPassword = await bcryptjs.hash(model.password, salt);
        const createdUser = await userSchema.create({
          ...model,
          password: hashedPassword,
          avatar: avatar,
        });
    
        const refreshToken = await this.generateRefreshToken(createdUser._id);
        await refreshToken.save();
    
        return generateJwtToken(createdUser._id, refreshToken.token);
    }
    
    public generateRefreshToken = async(userId: string): Promise<any> => {
        return new RefreshTokenSchema({
          user: userId,
          token: randomTokenString(),
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
    }
}

export default new UserSerice();