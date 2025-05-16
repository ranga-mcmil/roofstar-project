/**
 * colors/types.ts
 * 
 * This file contains the TypeScript type definitions for color-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { CreateColorSchema, UpdateColorSchema } from './schema';

// Schema-derived types
export type CreateColorPayload = z.infer<typeof CreateColorSchema>;
export type UpdateColorPayload = z.infer<typeof UpdateColorSchema>;

// Response types from API based on OpenAPI spec
export interface ColorDTO {
  id: number;
  name: string;
}

export type CreateColorResponse = ColorDTO;
export type GetColorResponse = ColorDTO;
export type UpdateColorResponse = ColorDTO;
export type GetColorsResponse = ColorDTO[];
