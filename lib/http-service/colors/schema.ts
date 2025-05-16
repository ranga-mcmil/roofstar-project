

/**
 * colors/schema.ts
 * 
 * This file contains the Zod validation schemas for color-related data.
 */

import { z } from 'zod';

export const CreateColorSchema = z.object({
  name: z.string().min(1),
});

export const UpdateColorSchema = z.object({
  name: z.string().min(1),
});
