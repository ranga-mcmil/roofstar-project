import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { QuickCreateButton } from "./components/quick-create-button"
import UsersClientContent from "./components/users-client-content"

interface UsersPageProps {
  search?: string
  branchId?: string
  page?: string
  pageSize?: string
}

export default async function UsersPage(props: {
  searchParams?: UsersPageProps;
}) {
  const searchParams = props.searchParams || {};
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Static header section - renders immediately on the server */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage system users and their permissions</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/users/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            
            {/* Quick Create Button - client component */}
            <QuickCreateButton />
          </div>
        </div>

        {/* Client component for dynamic content with loading states */}
        <UsersClientContent searchParams={searchParams as Record<string, string>} />
      </main>
    </div>
  )
}