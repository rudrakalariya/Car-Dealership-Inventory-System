import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
  role: z.enum(['customer', 'admin', 'manager']).default('customer')
});

export const validateUserRegistration = (data: unknown) => {
  try {
    return UserRegistrationSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (error.issues && error.issues.length > 0) {
        const issue = error.issues[0];
        if (issue) {
          let message = issue.message;
          if (message.includes('expected string, received undefined') || message === 'Required') {
            const field = String(issue.path[0]);
            message = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          }
          throw new Error(message, { cause: error });
        }
      }
      throw new Error('Validation failed', { cause: error });
    }
    throw error;
  }
};

export const UserLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const validateUserLogin = (data: unknown) => {
  try {
    return UserLoginSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (error.issues && error.issues.length > 0) {
        const issue = error.issues[0];
        if (issue) {
          let message = issue.message;
          if (message.includes('expected string, received undefined') || message === 'Required') {
            const field = String(issue.path[0]);
            message = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
          }
          throw new Error(message, { cause: error });
        }
      }
      throw new Error('Validation failed', { cause: error });
    }
    throw error;
  }
};
