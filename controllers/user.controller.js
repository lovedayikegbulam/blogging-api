import * as userService from "../services/user.service.js";
import logger from "../logger/logger.winston.js"; 

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await userService.getUserById(userId);
        logger.info("User details retrieved successfully"); 
        res.status(200).json({ message: 'User details retrieved successfully', data: user });
    } catch (error) {
        logger.error(`Failed to retrieve user details: ${error.message}`); 
        res.status(404).json({ message: 'User not found', error: error.message });
    }
};
