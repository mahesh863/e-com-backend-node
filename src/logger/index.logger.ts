import winston from 'winston';

import devLogger from './dev.logger';
import prodLogger from './prod.logger';

let logger: winston.Logger;

if (process.env.NODE_ENV !== 'production') {
  logger = devLogger();
} else {
  logger = prodLogger();
}

export default logger;
