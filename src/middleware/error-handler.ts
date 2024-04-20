import { ErrorRequestHandler } from 'express';
import { logger } from '../utils';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export const errorHandler: ErrorRequestHandler = async (err, _req, res, _next) => {
  if (err?.name === 'HttpStatusError') {
    logger.info(['HttpStatusError', err.statusCode, err.message]);

    return res.status(err.statusCode).send({
      message: err.message,
    });
  }

  if (!(err instanceof Error)) {
    logger.error(['Unexpected error', err]);
    logger.info(['Request body', _req.body]);
    logger.info(['Request headers', _req.headers]);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }

  logger.error(err.message);
  if (err.stack) {
    logger.info(err.stack);
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};
