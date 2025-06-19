/**
 * inventory/schema.ts
 * 
 * This file contains the Zod validation schemas for inventory-related data.
 * Updated to match API specification requirements.
 */

import { z } from 'zod';

export const AddInventorySchema = z.object({
  length: z.number().min(0.01, 'Length must be greater than 0').optional(),
  width: z.number().min(0.01, 'Width must be greater than 0').optional(),
  weight: z.number().min(0.01, 'Weight must be greater than 0').optional(),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  remarks: z.string().optional(),
});

export const AdjustInventorySchema = z.object({
  length: z.number().min(0.01, 'Length must be greater than 0').optional(),
  width: z.number().min(0.01, 'Width must be greater than 0').optional(),
  weight: z.number().min(0.01, 'Weight must be greater than 0').optional(),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  remarks: z.string().min(1, 'Reason is required'),
});