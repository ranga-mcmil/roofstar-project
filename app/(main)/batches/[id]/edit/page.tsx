import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBatchAction } from "@/actions/batches"
import { getBranchesAction } from "@/actions/branches"
import { GetBatchResponse } from "@/lib/http-service/batches/types"
import { BatchFormClient } from "../../components/batch-form-client"

interface EditBatchPageProps {
  params: {
    id: string
  }
}

export default async function EditBatchPage({ params }: EditBatchPageProps) {
  const id = parseInt(params.id, 10);

  // Fetch batch and related data in parallel
  const [
    batchResponse, 
    branchesResponse
  ] = await Promise.all([
    getBatchAction(id),
    getBranchesAction()
  ]);
  
  // Check for success and extract batch data
  let batch = undefined;
  if (batchResponse.success) {
    batch = batchResponse.data as GetBatchResponse;
  }

  // If batch not found, return 404
  if (!batch) {
    notFound();
  }

  // Get related data for the form
  const branches = branchesResponse.success ? branchesResponse.data.content : [];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/batches/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Batch: {batch.batchNumber}</h1>
            <p className="text-muted-foreground">Update batch information</p>
          </div>
        </div>

        <Card className="p-6">
          <BatchFormClient 
            batch={batch} 
            branches={branches}
            returnUrl={`/batches/${id}`} 
            isEditing={true}
          />
        </Card>
      </main>
    </div>
  )
}