/**
 * thicknesses/types.ts
 * 
 * This file contains the TypeScript type definitions for thickness-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { CreateThicknessSchema, UpdateThicknessSchema } from './schema';

// Schema-derived types
export type CreateThicknessPayload = z.infer<typeof CreateThicknessSchema>;
export type UpdateThicknessPayload = z.infer<typeof UpdateThicknessSchema>;

// Response types from API based on OpenAPI spec
export interface ThicknessDTO {
  id: number;
  thickness: number;
}

export type CreateThicknessResponse = ThicknessDTO;
export type GetThicknessResponse = ThicknessDTO;
export type UpdateThicknessResponse = ThicknessDTO;
export type GetThicknessesResponse = ThicknessDTO[];