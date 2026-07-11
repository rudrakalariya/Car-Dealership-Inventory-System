import * as db from '../../config/db';
import { validateVehicle } from '../../utils/validators';

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
    it('should throw an error if make is missing', () => {
      expect(() =>
        validateVehicle({ model: 'Corolla', category: 'Sedan', price: 25000, quantity: 10 })
      ).toThrow('Make is required');
    });

    it('should throw an error if model is missing', () => {
      expect(() =>
        validateVehicle({ make: 'Toyota', category: 'Sedan', price: 25000, quantity: 10 })
      ).toThrow('Model is required');
    });

    it('should throw an error if category is missing', () => {
      expect(() =>
        validateVehicle({ make: 'Toyota', model: 'Corolla', price: 25000, quantity: 10 })
      ).toThrow('Category is required');
    });

    it('should throw an error if price is missing', () => {
      expect(() =>
        validateVehicle({ make: 'Toyota', model: 'Corolla', category: 'Sedan', quantity: 10 })
      ).toThrow('Price is required');
    });

    it('should throw an error if quantity is missing', () => {
      expect(() =>
        validateVehicle({ make: 'Toyota', model: 'Corolla', category: 'Sedan', price: 25000 })
      ).toThrow('Quantity is required');
    });

    it('should throw an error if price is not positive', () => {
      expect(() =>
        validateVehicle({
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: -500,
          quantity: 10
        })
      ).toThrow('Price must be a positive number');

      expect(() =>
        validateVehicle({
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 0,
          quantity: 10
        })
      ).toThrow('Price must be a positive number');
    });

    it('should throw an error if quantity is a negative integer', () => {
      expect(() =>
        validateVehicle({
          make: 'Toyota',
          model: 'Corolla',
          category: 'Sedan',
          price: 25000,
          quantity: -1
        })
      ).toThrow('Quantity must be a non-negative integer');
    });
  });
});
