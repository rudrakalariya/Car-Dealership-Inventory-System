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

    it('should reject non-admin users with 403', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });
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

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 201 and create vehicle on successful request with valid token', async () => {
      const validToken = generateToken({ id: 1, role: 'admin' });

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

  describe('GET /api/vehicles/search', () => {
    it('should return 401 if token is missing', async () => {
      const response = await request(app).get('/api/vehicles/search?make=Toyota');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should search by make (case-insensitive)', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, make: 'Toyota', model: 'Corolla' }] });

      const response = await request(app)
        .get('/api/vehicles/search?make=toyota')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      // We expect the query to contain some form of ILIKE or LOWER() for case-insensitivity
      expect(mockQuery.mock.calls[0][0].toLowerCase()).toContain('ilike');
    });

    it('should search by model', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, make: 'Toyota', model: 'Corolla' }] });

      const response = await request(app)
        .get('/api/vehicles/search?model=Corolla')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(mockQuery.mock.calls[0][0].toLowerCase()).toContain('model');
    });

    it('should search by category', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, make: 'Toyota', category: 'Sedan' }] });

      const response = await request(app)
        .get('/api/vehicles/search?category=Sedan')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should search by price range (min/max)', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, make: 'Toyota', price: 20000 }] });

      const response = await request(app)
        .get('/api/vehicles/search?minPrice=15000&maxPrice=25000')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      const queryString = mockQuery.mock.calls[0][0].toLowerCase();
      expect(queryString).toContain('price >=');
      expect(queryString).toContain('price <=');
    });

    it('should handle combined filters', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 1, make: 'Toyota', model: 'Corolla', category: 'Sedan' }]
      });

      const response = await request(app)
        .get('/api/vehicles/search?make=Toyota&category=Sedan')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      const queryString = mockQuery.mock.calls[0][0].toLowerCase();
      expect(queryString).toContain('make ilike');
      expect(queryString).toContain('category ilike');
    });

    it('should handle empty results gracefully', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/vehicles/search?make=NonExistentMake')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    const updateData = {
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      price: 25000,
      quantity: 10
    };

    it('should return 401 if token is missing', async () => {
      const response = await request(app).put('/api/vehicles/1').send(updateData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject non-admin users with 403', async () => {
      const validToken = generateToken({ id: 1, role: 'customer' });
      const response = await request(app)
        .put('/api/vehicles/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should update all fields with valid data', async () => {
      const validToken = generateToken({ id: 1, role: 'admin' });
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            ...updateData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      });

      const response = await request(app)
        .put('/api/vehicles/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('make', 'Toyota');
      expect(response.body).toHaveProperty('model', 'Camry');
      expect(response.body).toHaveProperty('price', 25000);
    });

    it('should support partial field updates', async () => {
      const validToken = generateToken({ id: 1, role: 'admin' });
      const partialData = { price: 26000 };

      mockQuery.mockResolvedValueOnce({
        rows: [
          { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', quantity: 10, price: 26000 }
        ]
      });

      const response = await request(app)
        .put('/api/vehicles/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send(partialData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('price', 26000);
    });

    it('should return 404 for non-existent vehicles', async () => {
      const validToken = generateToken({ id: 1, role: 'admin' });
      mockQuery.mockResolvedValueOnce({ rows: [] }); // Simulate DB returning 0 rows

      const response = await request(app)
        .put('/api/vehicles/999')
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate and reject invalid data', async () => {
      const validToken = generateToken({ id: 1, role: 'admin' });
      const invalidData = { price: -5000 }; // Negative price should fail validation

      const response = await request(app)
        .put('/api/vehicles/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should return 401 if token is missing', async () => {
      const response = await request(app).delete('/api/vehicles/1');
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject non-admin users with 403', async () => {
      // customer token
      const validToken = generateToken({ id: 1, role: 'customer' });
      const response = await request(app)
        .delete('/api/vehicles/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should allow admin to delete vehicle', async () => {
      const adminToken = generateToken({ id: 2, role: 'admin' });
      mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // Simulate DB returning 1 deleted row

      const response = await request(app)
        .delete('/api/vehicles/1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
      // Ensure the query was called properly
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE'), [1]);
    });

    it('should return 404 for non-existent vehicle', async () => {
      const adminToken = generateToken({ id: 2, role: 'admin' });
      mockQuery.mockResolvedValueOnce({ rowCount: 0 }); // Simulate DB returning 0 deleted rows

      const response = await request(app)
        .delete('/api/vehicles/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    const validToken = generateToken({ id: 1, role: 'customer' });
    const vehicleBase = { id: 1, make: 'Honda', model: 'Civic', category: 'Sedan', price: 20000 };

    it('should return 401 if token is missing', async () => {
      const response = await request(app).post('/api/vehicles/1/purchase').send({ quantity: 1 });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should allow customer to purchase vehicle and decrease quantity', async () => {
      // First query to check vehicle existence and stock
      mockQuery.mockResolvedValueOnce({ rows: [{ ...vehicleBase, quantity: 5 }] });
      // Second query to update stock
      mockQuery.mockResolvedValueOnce({ rows: [{ ...vehicleBase, quantity: 4 }] });

      const response = await request(app)
        .post('/api/vehicles/1/purchase')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Purchase successful');
      expect(response.body.vehicle).toHaveProperty('quantity', 4);
    });

    it('should prevent purchase when completely out of stock', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ ...vehicleBase, quantity: 0 }] });

      const response = await request(app)
        .post('/api/vehicles/1/purchase')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Vehicle is out of stock');
    });

    it('should validate purchase quantity against available stock', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ ...vehicleBase, quantity: 2 }] });

      const response = await request(app)
        .post('/api/vehicles/1/purchase')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ quantity: 3 }); // Trying to buy more than available

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Insufficient stock');
    });

    it('should return 404 for non-existent vehicle', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] }); // DB returns 0 rows for vehicle check

      const response = await request(app)
        .post('/api/vehicles/999/purchase')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ quantity: 1 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Vehicle not found');
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    const adminToken = generateToken({ id: 2, role: 'admin' });
    const vehicleBase = { id: 1, make: 'Honda', model: 'Civic', category: 'Sedan', price: 20000 };

    it('should return 401 if token is missing', async () => {
      const response = await request(app).post('/api/vehicles/1/restock').send({ quantity: 5 });
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject non-admin users with 403', async () => {
      const customerToken = generateToken({ id: 1, role: 'customer' });
      const response = await request(app)
        .post('/api/vehicles/1/restock')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should allow admin to restock vehicle and increase quantity', async () => {
      // Query to update stock
      mockQuery.mockResolvedValueOnce({ rows: [{ ...vehicleBase, quantity: 7 }] });

      const response = await request(app)
        .post('/api/vehicles/1/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Restock successful');
      expect(response.body.vehicle).toHaveProperty('quantity', 7);
    });

    it('should validate restock quantity (reject negative values)', async () => {
      const response = await request(app)
        .post('/api/vehicles/1/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -2 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent vehicle', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] }); // DB returns 0 rows for vehicle check

      const response = await request(app)
        .post('/api/vehicles/999/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Vehicle not found');
    });
  });
});
