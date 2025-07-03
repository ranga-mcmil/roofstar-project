/**
 * products/schema.ts
 * 
 * This file contains the Zod validation schemas for product-related data.
 * Updated to match API specification requirements exactly.
 */

import { z } from 'zod';

// Enum for type of product status
export const TypeOfProductStatusEnum = z.enum(["LENGTH_WIDTH", "WEIGHT", "UNKNOWN"]);

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  code: z.number().int().min(1, 'Product code must be a positive integer'),
  colorId: z.number().int().min(1, 'Color ID is required'),
  thicknessId: z.number().int().min(1, 'Thickness ID is required'),
  productCategoryId: z.number().int().min(1, 'Product category ID is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  unitOfMeasureId: z.number().int().min(1, 'Unit of measure ID is required'),
  typeOfProduct: TypeOfProductStatusEnum,
  isReferable: z.boolean().optional(),
  referrablePercentage: z.number().min(0).max(100, 'Referrable percentage must be between 0 and 100').optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  code: z.number().int().min(1, 'Product code must be a positive integer'),
  colorId: z.number().int().min(1, 'Color ID is required'),
  thicknessId: z.number().int().min(1, 'Thickness ID is required'),
  productCategoryId: z.number().int().min(1, 'Product category ID is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  unitOfMeasureId: z.number().int().min(1, 'Unit of measure ID is required'),
  typeOfProduct: TypeOfProductStatusEnum,
  isReferable: z.boolean().optional(),
  referrablePercentage: z.number().min(0).max(100, 'Referrable percentage must be between 0 and 100').optional(),
});