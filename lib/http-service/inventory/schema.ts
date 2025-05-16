/**
 * inventory/schema.ts
 * 
 * This file contains the Zod validation schemas for inventory-related data.
 */

import { z } from 'zod';

export const AddInventorySchema = z.object({
  quantity: z.number(),
  remarks: z.string().optional(),
});

export const AdjustInventorySchema = z.object({
  quantity: z.number(),
  reason: z.string(),
});
