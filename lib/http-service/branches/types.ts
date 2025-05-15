import { z } from "zod";
import { UpdateBranchSchema, CreateBranchSchema } from "./schema";

export type CreateBranchPayload = z.infer<typeof CreateBranchSchema>
export type UpdateBranchPayload = z.infer<typeof UpdateBranchSchema>

export type BranchResponse = {
  id: string;
  name: string;
  location: string;
  status: string;
  address: {
    street: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
};

export type GetBranchesResponse = BranchResponse[];
export type GetBranchResponse = BranchResponse;
export type CreateBranchResponse = BranchResponse;
export type UpdateBranchResponse = BranchResponse;
