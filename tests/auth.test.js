import { registerUser, login} from '../services/auth.service.js'; 
import User from '../database/schema/user.schema.js'; 
import bcrypt from 'bcrypt';
import Jwt from "jsonwebtoken";


describe('registerUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    // Mock the User.findOne method to return null, indicating that the user doesn't exist yet
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    // Mock the bcrypt.hash method to return a hashed password
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

    // Mock the User.save method to return the newly created user
    jest.spyOn(User.prototype, 'save').mockResolvedValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword'
    });

    // Call the registerUser function
    const result = await registerUser('Test User', 'test@example.com', 'password');

    // Verify the result
    expect(result).toEqual({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword'
    });
  });

  it('should throw an error if user already exists', async () => {
    // Mock the User.findOne method to return an existing user
    jest.spyOn(User, 'findOne').mockResolvedValue({
      name: 'Existing User',
      email: 'existing@example.com',
      password: 'existingPassword'
    });

    // Call the registerUser function and expect it to throw an error
    await expect(registerUser('Existing User', 'existing@example.com', 'password')).rejects.toThrow();
  });
});



describe('login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log in a user and return a token', async () => {
    // Define test data
    const email = 'test@example.com';
    const password = 'password';

    // Mock the User.findOne method to return a user with a hashed password
    jest.spyOn(User, 'findOne').mockResolvedValue({
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10) // Hash the password
    });

    // Mock bcrypt.compareSync to return true
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

    // Mock the Jwt.sign method to return a token
    jest.spyOn(Jwt, 'sign').mockReturnValue('token');

    // Call the login function
    const result = await login('test@example.com', 'password');

    // Verify the result
    expect(result).toEqual({
      token: 'token',
      user: { email: 'test@example.com', password: expect.any(String) } // Expect any string for the hashed password
    });
  });

  it('should throw an error if user is not found', async () => {
    // Mock the User.findOne method to return null, indicating that the user doesn't exist
    jest.spyOn(User, 'findOne').mockResolvedValue(null);

    // Call the login function and expect it to throw an error
    await expect(login('nonexistent@example.com', 'password')).rejects.toThrow('User not found');
  });

  it('should throw an error if password is incorrect', async () => {
    // Mock the User.findOne method to return a user with a hashed password
    jest.spyOn(User, 'findOne').mockResolvedValue({
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10) // Hash the password
    });

    // Mock bcrypt.compareSync to return false
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

    // Call the login function and expect it to throw an error
    await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Username or Password is incorrect');
  });
});
