import { createClient, RedisClientType } from 'redis';
import logger from '../logger/index.logger';

let redisClient: RedisClientType;

const redisConfig = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    await redisClient.connect();
    logger.info('Redis connected');
  } catch (e) {
    logger.info('Failed to connect redis');

    console.error(e);
  }
};

export { redisConfig, redisClient };
