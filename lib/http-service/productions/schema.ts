/**
 * productions/schema.ts
 * 
 * This file contains the Zod validation schemas for production-related data.
 */

import { z } from 'zod';

export const CreateProductionSchema = z.object({
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  remarks: z.string().optional(),
});