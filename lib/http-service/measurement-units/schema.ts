/**
 * measurement-units/schema.ts
 * 
 * This file contains the Zod validation schemas for measurement unit-related data.
 */

import { z } from 'zod';

export const CreateMeasurementUnitSchema = z.object({
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
});

export const UpdateMeasurementUnitSchema = z.object({
  unitOfMeasure: z.string().min(1, 'Unit of measure is required'),
});