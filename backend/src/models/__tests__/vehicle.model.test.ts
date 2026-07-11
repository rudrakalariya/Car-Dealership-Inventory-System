import { Vehicle } from '../vehicle.model';
import * as db from '../../config/db';

jest.mock('../../config/db', () => ({
  query: jest.fn()
}));

const mockQuery = db.query as jest.Mock;

describe('Vehicle Model', () => {
  beforeEach(() => {
    mockQuery.mockClear();
    mockQuery.mockResolvedValue({
      rows: [
        {
          id: 1,
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 25000.0,
          quantity: 10,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
    });
  });

  describe('Validation', () => {
    it('should throw an error if make is missing', async () => {
      await expect(
        Vehicle.create({ model: 'Corolla', category: 'Sedan', price: 25000, quantity: 10 })
      ).rejects.toThrow('Make is required');
    });

    it('should throw an error if model is missing', async () => {
      await expect(
        Vehicle.create({ make: 'Toyota', category: 'Sedan', price: 25000, quantity: 10 })
      ).rejects.toThrow('Model is required');
    });

    it('should throw an error if category is missing', async () => {
      await expect(
        Vehicle.create({ make: 'Toyota', model: 'Corolla', price: 25000, quantity: 10 })
      ).rejects.toThrow('Category is required');
    });

    it('should throw an error if price is missing', async () => {
      await expect(
        Vehicle.create({ make: 'Toyota', model: 'Corolla', category: 'Sedan', quantity: 10 })
      ).rejects.toThrow('Price is required');
    });

    it('should throw an error if quantity is missing', async () => {
      await expect(
        Vehicle.create({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000 })
      ).rejects.toThrow('Quantity is required');
    });

    it('should throw an error if price is not positive', async () => {
      await expect(
        Vehicle.create({
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: -500,
          quantity: 10
        })
      ).rejects.toThrow('Price must be a positive number');

      await expect(
        Vehicle.create({
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 0,
          quantity: 10
        })
      ).rejects.toThrow('Price must be a positive number');
    });

    it('should throw an error if quantity is a negative integer', async () => {
      await expect(
        Vehicle.create({
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 25000,
          quantity: -1
        })
      ).rejects.toThrow('Quantity must be a non-negative integer');
    });
  });
});
