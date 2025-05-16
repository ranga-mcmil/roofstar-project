/**
 * thicknesses/schema.ts
 * 
 * This file contains the Zod validation schemas for thickness-related data.
 */

import { z } from 'zod';

export const CreateThicknessSchema = z.object({
  thickness: z.number(),
});

export const UpdateThicknessSchema = z.object({
  thickness: z.number(),
});
