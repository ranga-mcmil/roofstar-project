// app/(main)/users/components/users-table.tsx - Fixed role display and deactivate link
'use client';

import { useTransition } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Eye, KeyRound, Power, UserX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ServerPagination } from "@/components/server-pagination";
import { UserDTO } from "@/lib/http-service/users/types";
import { BranchDTO } from "@/lib/http-service/branches/types";
import { Skeleton } from "@/components/ui/skeleton";
import { USER_ROLES } from "@/lib/types";

interface UsersTableProps {
  users: UserDTO[];
  branches: BranchDTO[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    startIndex: number;
    endIndex: number;
  };
  searchParams?: Record<string, string>;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function UsersTable({
  users,
  branches,
  pagination,
  searchParams,
  isLoading = false,
  onRefresh
}: UsersTableProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // Combined loading state
  const loading = isLoading || isPending;

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      router.refresh();
    }
  };

  // Get role badge - CONSISTENT WITH API RESPONSE
  const getRoleBadge = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
      case 'ROLE_ADMIN':
        return <Badge className="bg-purple-500">Admin</Badge>;
      case USER_ROLES.MANAGER:
      case 'ROLE_MANAGER':
        return <Badge className="bg-blue-500">Manager</Badge>;
      case USER_ROLES.SALES_REP:
      case 'ROLE_SALES_REP':
        return <Badge variant="outline">Sales Rep</Badge>;
      default:
        // Handle any other role format by cleaning it up
        const cleanRole = role.replace('ROLE_', '').replace('_', ' ');
        return <Badge variant="secondary">{cleanRole}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500">Active</Badge>
    ) : (
      <Badge className="bg-red-500">Inactive</Badge>
    );
  };

  // Generate skeleton rows for loading state
  const renderSkeletonRows = () => {
    return Array.from({ length: pagination.itemsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-8 rounded-full ml-auto" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              renderSkeletonRows()
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.branchName || 'Not Assigned'}</TableCell>
                  <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${user.id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${user.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${user.id}/change-password`}>
                            <KeyRound className="mr-2 h-4 w-4" /> Change Password
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/users/${user.id}/toggle-status`}>
                            <Power className="mr-2 h-4 w-4" /> 
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.isActive && (
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/users/${user.id}/delete`}
                              className="text-destructive focus:text-destructive"
                            >
                              <UserX className="mr-2 h-4 w-4" /> Deactivate
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {(users.length > 0 || loading) && (
        <div className="flex items-center justify-between mt-4">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              <Skeleton className="h-5 w-48" />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Showing {pagination.startIndex + 1} to {pagination.endIndex} of {pagination.totalItems} users
            </div>
          )}
          <ServerPagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages} 
            pathName='/users' 
            searchParams={searchParams}
            isLoading={loading}
          />
        </div>
      )}
    </>
  );
}