import { z } from 'zod';

export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (error.issues && error.issues.length > 0) {
        const issue = error.issues[0];
        if (issue) {
          let message = issue.message;
          if (
            message.includes('expected string, received undefined') ||
            message.includes('expected number, received undefined') ||
            message === 'Required'
          ) {
            const field = String(issue.path[0]);
            message = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          }
          throw new Error(message, { cause: error });
        }
      }
      /* istanbul ignore next */
      throw new Error('Validation failed', { cause: error });
    }
    /* istanbul ignore next */
    throw error;
  }
};

export const UserRegistrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
  role: z.enum(['customer', 'admin', 'manager']).default('customer')
});

export const validateUserRegistration = (data: unknown) =>
  validateData(UserRegistrationSchema, data);

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const validateUserLogin = (data: unknown) => validateData(UserLoginSchema, data);

export const VehicleSchema = z.object({
  make: z.string(),
  model: z.string(),
  category: z.string(),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  quantity: z
    .number()
    .int('Quantity must be a non-negative integer')
    .min(0, 'Quantity must be a non-negative integer')
});

export const validateVehicle = (data: unknown) => validateData(VehicleSchema, data);

export const VehicleUpdateSchema = VehicleSchema.partial();

export const validateVehicleUpdate = (data: unknown) => validateData(VehicleUpdateSchema, data);

export const PurchaseSchema = z.object({
  quantity: z.number().int('Quantity must be an integer').positive('Quantity must be at least 1')
});

export const validatePurchase = (data: unknown) => validateData(PurchaseSchema, data);

export const RestockSchema = PurchaseSchema;
export const validateRestock = (data: unknown) => validateData(RestockSchema, data);
