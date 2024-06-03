import dotenv from 'dotenv'
dotenv.config()

const config =  {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    LOCAL_HOST: process.env.LOCAL_HOST,
    SALT_ROUND: process.env.SALT_ROUND,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT
}

export default config;