import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BatchFormClient } from "../components/batch-form-client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"

export default async function NewBatchPage() {
  // Get user session to extract branchId
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  // For managers, get their assigned branchId
  const userBranchId = session.user.branchId;
  
  if (!userBranchId) {
    // If user doesn't have a branchId (shouldn't happen for managers), redirect
    redirect('/batches');
  }

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
            returnUrl="/batches"
            isEditing={false}
            userBranchId={userBranchId}
          />
        </Card>
      </main>
    </div>
  )
}