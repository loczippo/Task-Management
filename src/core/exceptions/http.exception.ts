import { Http } from 'winston/lib/winston/transports';

interface HttpException extends Error {
    status: number;
    message: string;
}

export default HttpException;
