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

  describe('GET /api/vehicles', () => {
    it('should return 401 if token is missing', async () => {
      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', 'Bearer invalidtoken123');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 200 and an empty array if no vehicles exist', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });

      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return 200 and a full list of vehicles from the database', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });

      const mockVehicles = [
        {
          id: 1,
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 20000,
          quantity: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          make: 'Honda',
          model: 'Civic',
          category: 'Sedan',
          price: 22000,
          quantity: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockVehicles });

      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('make', 'Toyota');
      expect(response.body[1]).toHaveProperty('make', 'Honda');
    });
  });
});
