import express from 'express';
import llmRouter from './llm';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const router = express.Router();

router.use('/api/llm', llmRouter);
 
router.use('*', (_req, res) => {
  res.status(StatusCodes.NOT_FOUND).send({
    message: ReasonPhrases.NOT_FOUND,
  });
});

export default router;
