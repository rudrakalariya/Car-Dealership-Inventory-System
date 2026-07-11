import request from 'supertest';
import app from '../../app';
import * as db from '../../config/db';

jest.mock('../../config/db', () => ({
  query: jest.fn()
}));

const mockQuery = db.query as jest.Mock;

describe('Auth Routes', () => {
  beforeEach(() => {
    mockQuery.mockClear();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return 201', async () => {
      // Mock the database returning the newly created user
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            username: 'testuser1',
            email: 'testuser1@example.com',
            role: 'customer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      });

      const response = await request(app).post('/api/auth/register').send({
        username: 'testuser1',
        email: 'testuser1@example.com',
        password: 'password123'
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('username', 'testuser1');
      expect(response.body).toHaveProperty('email', 'testuser1@example.com');
      // Password should not be returned in response!
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 if username is missing', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'testuser1@example.com',
        password: 'password123'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Username is required');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'testuser1',
        password: 'password123'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email is required');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'testuser1',
        email: 'testuser1@example.com'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Password is required');
    });

    it('should return 400 if email is invalid', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'testuser1',
        email: 'not-an-email',
        password: 'password123'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid email address');
    });
  });
});
