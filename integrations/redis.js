import { createClient } from 'redis';
import CONFIG from "../config/config.js";
import logger from "../logger/logger.winston.js";


const client = createClient({
    password: CONFIG.REDIS_PASSWORD,
    socket: {
        host: CONFIG.REDIS_HOST,
        port: CONFIG.REDIS_PORT
    }
});

client.on('connect', () => {
    logger.info('Redis client connected')
})

export default client;