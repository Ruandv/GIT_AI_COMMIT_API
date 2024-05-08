import { RequestHandler } from 'express';
import { logger } from '../utils';
import { StatusCodes } from 'http-status-codes';

export const headerValidationHandler: RequestHandler = async (req, res, next) => {
  logger.info(['Request headers', req.headers]);
  logger.info(['Request headers', req.headers]);

  if (req.method !== 'GET' && req.headers['x-secret'] === undefined) {
    logger.error('Request is missing the x-secret header');
    return res.status(StatusCodes.BAD_REQUEST).send({
      message: 'Request is missing a header',
    });
  }
  else {
    const xSecret = req.headers['x-secret'] as string;
    debugger;
    if (process.env.CLI_SECRET_TOKENS?.split(",").includes(xSecret)) {
      next();
    }
    else {
      logger.error('Request is missing the x-secret header');
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: 'Request is missing a header',
      });
    }
  }
};
