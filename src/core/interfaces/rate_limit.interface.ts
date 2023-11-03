interface IRateLimit {
  path: string;
  minutes: number;
  maxRequest: number;
}

export default IRateLimit;
