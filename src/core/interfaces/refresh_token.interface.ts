export interface IRefreshToken {
  user: string;
  token: string;
  expires: Date;
  created: Date;
  revoked: Date;
  createdByIp: string;
  replacedByToken: string;
  isActive: boolean;
  isExpired: boolean;
}
