import { z } from "zod";
import { UpdateUserSchema, CreateUserSchema, ChangePasswordSchema } from "./schema";

export type CreateUserPayload = z.infer<typeof CreateUserSchema>
export type UpdateUserPayload = z.infer<typeof UpdateUserSchema>
export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>




export type UserObj = {
  id: string;
  email: string;
  name: string;
  lastName: string;
  status: 'inactive' | 'active' | string;
  role: 'ROLE_ADMIN' | 'ROLE_USER' | string; // Extend with actual roles
  branchId: string | null;
};

export type GetUsersResponse = {
  content: UserObj[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};


export type GetUserResponse = UserObj
export type CreateUserResponse = UserObj
export type UpdateUserResponse = UserObj

