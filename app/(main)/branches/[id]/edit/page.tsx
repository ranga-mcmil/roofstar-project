import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBranchAction } from "@/actions/branches"
import { GetBranchResponse } from "@/lib/http-service/branches/types"
import { BranchFormClient } from "../../components/branch-form-client"

interface EditBranchPageProps {
  params: {
    id: string
  }
}

export default async function EditBranchPage({ params }: EditBranchPageProps) {
  const id = params.id;

  // Fetch branch data
  const response = await getBranchAction(id);
  
  // Check for success and extract branch data
  let branch = undefined;
  if (response.success) {
    branch = response.data as GetBranchResponse;
  }

  // If branch not found, return 404
  if (!branch) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/branches/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Branch: {branch.name}</h1>
            <p className="text-muted-foreground">Update branch information</p>
          </div>
        </div>

        <Card className="p-6">
          <BranchFormClient branch={branch} returnUrl={`/branches/${id}`} />
        </Card>
      </main>
    </div>
  )
}