import request from 'supertest';
import app from '../../app';
import * as db from '../../config/db';
import { generateToken } from '../../utils/tokenGenerator';

jest.mock('../../config/db', () => ({
  query: jest.fn()
}));

const mockQuery = db.query as jest.Mock;

describe('Vehicle Routes', () => {
  beforeEach(() => {
    mockQuery.mockClear();
  });

  describe('POST /api/vehicles', () => {
    it('should return 401 if token is missing', async () => {
      const response = await request(app).post('/api/vehicles').send({
        make: 'Toyota',
        model: 'Corolla',
        category: 'Sedan',
        price: 20000,
        quantity: 5
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', 'Bearer invalidtoken123')
        .send({
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 20000,
          quantity: 5
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 201 and create vehicle on successful request with valid token', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });

      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            make: 'Toyota',
            model: 'Corolla',
            category: 'Sedan',
            price: 20000,
            quantity: 5,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      });

      const response = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 20000,
          quantity: 5
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('make', 'Toyota');
      expect(response.body).toHaveProperty('category', 'Sedan');
      expect(response.body).toHaveProperty('quantity', 5);
    });
  });
});
