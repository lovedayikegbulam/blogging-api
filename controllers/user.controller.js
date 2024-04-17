import * as userService from "../services/user.service";

export const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await userService.getUserById(userId);
        res.status(200).json({ message: 'User details retrieved successfully', data: user });
    } catch (error) {
        res.status(404).json({ message: 'User not found', error: error.message });
    }
};
