
/**
 * categories/schema.ts
 * 
 * This file contains the Zod validation schemas for product category-related data.
 */

import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1),
});
