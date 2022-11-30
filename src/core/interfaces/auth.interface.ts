interface DataStoredInToken {
    id: string;
}
  
interface TokenData {
    token: string;
    refreshToken: string;
}

export { DataStoredInToken, TokenData }