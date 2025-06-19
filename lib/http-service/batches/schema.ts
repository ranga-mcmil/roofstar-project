/**
 * batches/schema.ts
 * 
 * This file contains the Zod validation schemas for batch-related data.
 */

import { z } from 'zod';

export const CreateBatchSchema = z.object({
  batchNumber: z.string().min(1, 'Batch number is required'),
  description: z.string().optional(),
});

export const UpdateBatchSchema = z.object({
  batchNumber: z.string().min(1, 'Batch number is required'),
  description: z.string().optional(),
});