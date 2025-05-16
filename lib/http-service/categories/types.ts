/**
 * categories/types.ts
 * 
 * This file contains the TypeScript type definitions for product category-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { CreateCategorySchema, UpdateCategorySchema } from './schema';

// Schema-derived types
export type CreateCategoryPayload = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryPayload = z.infer<typeof UpdateCategorySchema>;

// Response types from API based on OpenAPI spec
export interface ProductCategoryDTO {
  id: number;
  name: string;
}

export type CreateCategoryResponse = ProductCategoryDTO;
export type GetCategoryResponse = ProductCategoryDTO;
export type UpdateCategoryResponse = ProductCategoryDTO;
export type GetCategoriesResponse = ProductCategoryDTO[];
