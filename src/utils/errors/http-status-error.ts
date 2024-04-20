import { StatusCodes } from 'http-status-codes';

export class HttpStatusError extends Error {
  statusCode: StatusCodes;
  constructor(statusCode: StatusCodes, message: string) {
    super(message);

    this.name = 'HttpStatusError';
    this.statusCode = statusCode;
  }
}
