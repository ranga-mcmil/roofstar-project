import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { QuickCreateButton } from "./components/quick-create-button"
import BatchesClientContent from "./components/batches-client-content"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/next-auth-options"
import { redirect } from "next/navigation"
import { Suspense } from "react"

interface BatchesPageProps {
  search?: string
  branch?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: string
  pageSize?: string
}

export default async function BatchesPage(props: {
  searchParams?: BatchesPageProps;
}) {
  const searchParams = props.searchParams || {};
  
  // Get user session to extract branchId
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  // For managers, get their assigned branchId
  const userBranchId = session.user.branchId;
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Batches</h1>
            <p className="text-muted-foreground">Manage and track your production batches</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/batches/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
            {/* Quick Create Button - client component */}
            {userBranchId ? (
              <QuickCreateButton userBranchId={userBranchId} />
            ) : (
              <Button asChild>
                <Link href="/batches/new">
                  <Plus className="mr-2 h-4 w-4" /> New Batch
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <Suspense fallback={<div>Loading production form...</div>}>
          <BatchesClientContent searchParams={searchParams as Record<string, string>} />
        </Suspense>
      </main>
    </div>
  )
}