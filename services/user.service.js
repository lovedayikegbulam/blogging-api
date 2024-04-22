import User from "../database/schema/user.schema.js";
import logger from "../logger/logger.winston.js"; // Import the Winston logger

export const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        logger.info(`Retrieved user ${userId}`);
        return user;
    } catch (error) {
        logger.error(`Error fetching user: ${error.message}`);
        throw new Error(`Error fetching user: ${error.message}`);
    }
};
