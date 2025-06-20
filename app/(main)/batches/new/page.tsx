import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getBranchesAction } from "@/actions/branches"
import { BatchFormClient } from "../components/batch-form-client"

interface NewBatchPageProps {
  searchParams: {
    branchId?: string
  }
}

export default async function NewBatchPage({ searchParams }: NewBatchPageProps) {
  // Fetch related data
  const branchesResponse = await getBranchesAction();
  
  // Get related data for the form
  const branches = branchesResponse.success ? branchesResponse.data.content : [];

  // Pre-selected branch if provided in search params
  const selectedBranchId = searchParams.branchId;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/batches">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Batch</h1>
            <p className="text-muted-foreground">Add a new production batch</p>
          </div>
        </div>

        <Card className="p-6">
          <BatchFormClient 
            branches={branches}
            returnUrl="/batches"
            isEditing={false}
            selectedBranchId={selectedBranchId}
          />
        </Card>
      </main>
    </div>
  )
}