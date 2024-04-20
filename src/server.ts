import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import config from 'config';

const server = express();

server.use(express.json({ limit: '50mb' }));
server.use(morgan('tiny'));
server.use(helmet());
server.use(
  cors({
    origin: config.get<string | string[]>('cors.origin'),
  }),
);

export default server;
