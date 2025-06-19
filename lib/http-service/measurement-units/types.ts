/**
 * measurement-units/types.ts
 * 
 * This file contains the TypeScript type definitions for measurement unit-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { CreateMeasurementUnitSchema, UpdateMeasurementUnitSchema } from './schema';

// Schema-derived types
export type CreateMeasurementUnitPayload = z.infer<typeof CreateMeasurementUnitSchema>;
export type UpdateMeasurementUnitPayload = z.infer<typeof UpdateMeasurementUnitSchema>;

// Response types from API based on OpenAPI spec
export interface MeasurementUnitDTO {
  id: number;
  unitOfMeasure: string;
}

export type CreateMeasurementUnitResponse = MeasurementUnitDTO;
export type GetMeasurementUnitResponse = MeasurementUnitDTO;
export type UpdateMeasurementUnitResponse = MeasurementUnitDTO;
export type GetMeasurementUnitsResponse = MeasurementUnitDTO[];