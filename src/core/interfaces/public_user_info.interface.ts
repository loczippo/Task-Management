import RoleEnum from './../enums/role.enum';

interface IPublicUserInfo {
  _id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  createdAt?: Date;
  role?: RoleEnum;
}

export default IPublicUserInfo;
