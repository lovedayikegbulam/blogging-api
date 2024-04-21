import { getUserById } from '../services/user.service.js'; 
import User from '../database/schema/user.schema.js'; 

describe('getUserById', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a user by ID', async () => {
    // Define test data
    const userId = 'user123';
    const user = { _id: userId, name: 'Test User' };

    // Mock the behavior of the User.findById method
    jest.spyOn(User, 'findById').mockResolvedValue(user);

    // Call the getUserById function
    const result = await getUserById(userId);

    // Verify that the findById method was called with the correct userId
    expect(User.findById).toHaveBeenCalledWith(userId);

    // Verify that the result matches the expected user
    expect(result).toEqual(user);
  });

  it('should throw an error if user is not found', async () => {
    // Define test data
    const userId = 'invalidId';

    // Mock the behavior of the User.findById method to return null
    jest.spyOn(User, 'findById').mockResolvedValue(null);

    // Call the getUserById function and expect it to throw an error
    await expect(getUserById(userId)).rejects.toThrow('User not found');
  });

  it('should throw an error if an error occurs while fetching user', async () => {
    // Define test data
    const userId = 'user123';

    // Mock the behavior of the User.findById method to throw an error
    jest.spyOn(User, 'findById').mockRejectedValue(new Error('Database error'));

    // Call the getUserById function and expect it to throw an error
    await expect(getUserById(userId)).rejects.toThrow('Error fetching user: Database error');
  });
});
