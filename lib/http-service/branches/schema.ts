import { z } from 'zod';

export const CreateBranchSchema = z.object({
  name: z.string(),
  location: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    province: z.string(),
    country: z.string(),
    postalCode: z.string(),
  }),
});

export const UpdateBranchSchema = z.object({
  name: z.string(),
  location: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    province: z.string(),
    country: z.string(),
    postalCode: z.string(),
  }),
});
