import HTTP_STATUS from 'http-status-codes';

export interface IErrorResponse {
    message: string;
    statusCode: number;
    status: string;

    serializeError(): IError;
}

export interface IError {
    message: string;
    statusCode: number;
    status: string;
}

export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract status: string;

    constructor(message: string) {
        super(message);
    }

    serializeError(): IError {

        return {
            message: this.message,
            status: this.status,
            statusCode: this.statusCode
        }
    }
}

export class BadRequestError extends CustomError {
    status = 'error';
    statusCode = HTTP_STATUS.BAD_REQUEST;

    constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends CustomError {
    status = 'error';
    statusCode = HTTP_STATUS.NOT_FOUND;

    constructor(message: string) {
        super(message);
    }
}

export class NotAuthorizeError extends CustomError {
    status = 'error';
    statusCode = HTTP_STATUS.UNAUTHORIZED;

    constructor(message: string) {
        super(message);
    }
}

export class FileToLargeError extends CustomError {
    status = 'error';
    statusCode = HTTP_STATUS.REQUEST_TOO_LONG;

    constructor(message: string) {
        super(message);
    }
}

export class ServiceError extends CustomError {
    status = 'error';
    statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;

    constructor(message: string) {
        super(message);
    }
}export class JoiRequestError extends CustomError {
    status = 'error';
    statusCode = HTTP_STATUS.BAD_REQUEST;

    constructor(message: string) {
        super(message);
    }
}
