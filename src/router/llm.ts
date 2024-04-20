/* eslint-disable indent */
import { asyncHandler, logger } from '../utils';
import express, { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import LLMService from '../services/llm.service';
import { ICallRequest } from '../models/call.request.model';

const router = express.Router();
const llmService = new LLMService();

router.post('/generateCommit', asyncHandler(async (_request: Request, response: Response) => {
    /*read the body and transform it to a export interface ICallRequest {
    prompt: string;
    historyId: string;
    config?: ICallConfig;
} where ICallConfig = {"language":"english"}
 */
    logger.info('Request received');
    
    const requestData: ICallRequest = _request.body;
    logger.log('requestData', JSON.stringify(requestData));
    const result = await llmService.generateCommit(requestData);
    logger.log("result", result);
    response.status(StatusCodes.OK).send({ message: result });

}));
export default router;
