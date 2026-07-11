import request from 'supertest';
import app from '../../app';
import * as db from '../../config/db';
import bcrypt from 'bcrypt';

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

    it('should return 400 if username already exists', async () => {
      // Mock the database throwing a unique constraint violation for username
      mockQuery.mockRejectedValueOnce({
        code: '23505',
        constraint: 'users_username_key'
      });

      const response = await request(app).post('/api/auth/register').send({
        username: 'duplicateuser',
        email: 'second@example.com',
        password: 'password123'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Username already exists');
    });

    it('should return 400 if email already exists', async () => {
      // Mock the database throwing a unique constraint violation for email
      mockQuery.mockRejectedValueOnce({
        code: '23505',
        constraint: 'users_email_key'
      });

      const response = await request(app).post('/api/auth/register').send({
        username: 'seconduser',
        email: 'duplicate@example.com',
        password: 'password123'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email already exists');
    });

    it('should return 400 if password is less than 6 characters', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'testuser1',
        email: 'test@example.com',
        password: 'short'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Password must be at least 6 characters');
    });

    it('should return 400 if password is more than 20 characters', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'testuser1',
        email: 'test@example.com',
        password: 'thispasswordiswaytoolongtobeaccepted'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Password must not exceed 20 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 and a token for successful login', async () => {
      const hashed = await bcrypt.hash('password123', 10);

      // Mock the database finding the user
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            password: hashed,
            role: 'customer'
          }
        ]
      });

      // Assuming comparePassword will return true since we mock bcrypt in a way
      // Actually wait, comparePassword runs actual bcrypt, so we need to either mock comparePassword or just expect 404 for now since endpoint is missing.
      // We will refine the mock when we implement GREEN, but for RED, just sending the request is enough.

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app).post('/api/auth/login').send({
        password: 'password123'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email is required');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com'
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Password is required');
    });

    it('should return 401 if user does not exist', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] }); // User not found

      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123'
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });

    it('should return 401 if password is incorrect', async () => {
      const hashed = await bcrypt.hash('password123', 10);

      // We'll mock the user existing, but the comparePassword logic will fail it because we send 'wrongpassword'
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            username: 'testuser',
            email: 'test@example.com',
            password: hashed,
            role: 'customer'
          }
        ]
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });
  });
});
