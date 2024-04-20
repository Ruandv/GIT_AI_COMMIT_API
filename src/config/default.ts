// https://github.com/node-config/node-config/wiki/Configuration-Files#file-load-order

// Uncomment the below lines to load secrets into config

// import { getSecret } from '../utils';
// import { resolve } from 'path';
// const SECRET_PATH = process.env.SECRET_PATH ?? resolve('../etc/secrets');
// getSecret<string>('SECRET-NAME', SECRET_PATH);

export default {
  app: {
    port: 3002,
  },
  cors: {
    origin: '*',
  },
};
