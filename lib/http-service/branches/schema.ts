/**
 * branches/schema.ts
 * 
 * This file contains the Zod validation schemas for branch-related data.
 * Updated to match API specification requirements.
 */

import { z } from 'zod';

export const CreateBranchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  location: z.string().min(1, 'Location is required'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    country: z.string().optional(), // Made optional to match API spec
    postalCode: z.string().optional(), // Made optional to match API spec
  }),
});

export const UpdateBranchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  location: z.string().min(1, 'Location is required'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    country: z.string().optional(), // Made optional to match API spec
    postalCode: z.string().optional(), // Made optional to match API spec
  }),
});