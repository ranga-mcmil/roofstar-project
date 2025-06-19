/**
 * products/schema.ts
 * 
 * This file contains the Zod validation schemas for product-related data.
 * Updated to match API specification requirements.
 */

import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  code: z.number().int().min(1, 'Product code must be a positive integer'),
  colorId: z.number().int().min(1, 'Color ID is required'),
  thicknessId: z.number().int().min(1, 'Thickness ID is required'),
  productCategoryId: z.number().int().min(1, 'Product category ID is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  unitOfMeasureId: z.number().int().min(1, 'Unit of measure ID is required') // Added missing field
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  code: z.number().int().min(1, 'Product code must be a positive integer'),
  colorId: z.number().int().min(1, 'Color ID is required'),
  thicknessId: z.number().int().min(1, 'Thickness ID is required'),
  productCategoryId: z.number().int().min(1, 'Product category ID is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  unitOfMeasureId: z.number().int().min(1, 'Unit of measure ID is required') // Added missing field
});