<<<<<<< HEAD
class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
=======
interface HttpException extends Error {
  status: number;
  message: string;
>>>>>>> d02f48cb9967a0e130abf314858ca88e90add3e0
}

export default HttpException;
