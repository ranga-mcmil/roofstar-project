// lib/http-service/customers/types.ts
/**
 * customers/types.ts
 * 
 * This file contains the TypeScript type definitions for customer-related data
 * based on the OpenAPI specification.
 */

import { z } from 'zod';
import { CreateCustomerSchema, UpdateCustomerSchema } from './schema';

// Schema-derived types
export type CreateCustomerPayload = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerPayload = z.infer<typeof UpdateCustomerSchema>;

// Response types from API based on OpenAPI spec
export interface CustomerDTO {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  address: string;
  tin: string;
  vatNumber: string;
}

export interface CustomerPaginationParams {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  branchId?: string;
}

export interface PaginationResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export type CreateCustomerResponse = CustomerDTO;
export type GetCustomerResponse = CustomerDTO;
export type UpdateCustomerResponse = CustomerDTO;
export type GetCustomersResponse = PaginationResponse<CustomerDTO>;
