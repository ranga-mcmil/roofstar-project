

/**
 * products/schema.ts
 * 
 * This file contains the Zod validation schemas for product-related data.
 */

import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  code: z.number().int(),
  colorId: z.number().int(),
  thicknessId: z.number().int(),
  productCategoryId: z.number().int(),
  price: z.number()
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1),
  code: z.number().int(),
  colorId: z.number().int(),
  thicknessId: z.number().int(),
  productCategoryId: z.number().int(),
  price: z.number()
});
