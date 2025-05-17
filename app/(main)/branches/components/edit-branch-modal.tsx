'use client';

import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BranchDTO } from "@/lib/http-service/branches/types";

interface EditBranchButtonProps {
  branch: BranchDTO;
  triggerClassName?: string;
}

export function EditBranchButton({ branch, triggerClassName = "w-full justify-start font-normal" }: EditBranchButtonProps) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={triggerClassName}
      asChild
    >
      <Link href={`/branches/${branch.id}/edit`}>
        <Edit className="mr-2 h-4 w-4" /> Edit
      </Link>
    </Button>
  );
}