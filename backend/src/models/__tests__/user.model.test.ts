import { User } from '../user.model';
import * as db from '../../config/db';

jest.mock('../../config/db', () => ({
  query: jest.fn()
}));

const mockQuery = db.query as jest.Mock;

describe('User Model', () => {
  beforeEach(() => {
    mockQuery.mockClear();
    mockQuery.mockResolvedValue({
      rows: [
        {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: 'customer',
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
    });
  });
  describe('Validation', () => {
    it('should throw an error if username is missing', async () => {
      await expect(
        User.create({ email: 'test@example.com', password: 'password123' })
      ).rejects.toThrow('Username is required');
    });

    it('should throw an error if email is missing', async () => {
      await expect(User.create({ username: 'testuser', password: 'password123' })).rejects.toThrow(
        'Email is required'
      );
    });

    it('should throw an error if password is missing', async () => {
      await expect(
        User.create({ username: 'testuser', email: 'test@example.com' })
      ).rejects.toThrow('Password is required');
    });
  });

  describe('Creation', () => {
    it('should assign customer role by default', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(user.role).toBe('customer');
    });

    it('should hash the password', async () => {
      const rawPassword = 'password123';
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: rawPassword
      });
      expect(user.password).toBeDefined();
      expect(user.password).not.toBe(rawPassword);
    });
  });

  describe('Password Comparison', () => {
    it('should return true for matching password', async () => {
      const rawPassword = 'password123';
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: rawPassword
      });

      const isMatch = await User.comparePassword(rawPassword, user.password as string);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const isMatch = await User.comparePassword('wrongpassword', user.password as string);
      expect(isMatch).toBe(false);
    });
  });
});
