import server from './server';
import { logger } from './utils';
import router from './router';
import { errorHandler, headerValidationHandler } from './middleware';
import config from 'config';

const PORT = config.get<number>('app.port');

// set the view engine to ejs
server.set('view engine', 'ejs');
server.set('views', `${__dirname}/views`);

server.use(headerValidationHandler);
server.use(router);

server.use(errorHandler);

server.listen(PORT,'0.0.0.0', () => {
  logger.info(`Server Listening on port: ${PORT}`);
});
 