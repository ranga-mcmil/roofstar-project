import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar } from "lucide-react"
import { BranchesTable } from "./components/branches-table"
import { BranchesFilters } from "./components/branches-filters"
import { getBranchesAction, getBranchStatsAction } from "@/actions/branches"
import { BranchDTO } from "@/lib/http-service/branches/types"

interface BranchesPageProps {
  search?: string
  status?: string
  sortField?: string
  sortDirection?: "asc" | "desc"
  page?: string
  pageSize?: string
}

export default async function BranchesPage(props: {
  searchParams?: BranchesPageProps;
}) {
  const searchParams = props.searchParams || {};

  // Parse search params
  const search = searchParams.search || ""
  const status = searchParams.status || "all"
  const sortField = searchParams.sortField || "name"
  const sortDirection = (searchParams.sortDirection || "desc") as "asc" | "desc"
  const page = Number.parseInt(searchParams.page || "1", 10)
  const pageSize = Number.parseInt(searchParams.pageSize || "10", 10)

  // Prepare API filter for active status
  let isActive: boolean | undefined = undefined;
  if (status === 'active') {
    isActive = true;
  } else if (status === 'inactive') {
    isActive = false;
  }

  // Get branches data with pagination
  const branchesResponse = await getBranchesAction({
    pageNo: page - 1, // API uses 0-based indexing
    pageSize: pageSize,
    sortBy: sortField,
    sortDir: sortDirection
  });

  // Get branch statistics
  const statsResponse = await getBranchStatsAction();

  // Initialize branches and stats
  let branches: BranchDTO[] = [];
  let totalItems = 0;
  let totalPages = 1;
  
  let branchStats = {
    numberOfBranches: 0,
    numberOfActiveBranches: 0,
    numberOfInactiveBranches: 0,
    numberOfAssignedUsers: 0
  };

  // Process branch data
  if (branchesResponse.success && branchesResponse.data) {
    branches = branchesResponse.data.content;
    totalItems = branchesResponse.data.totalElements;
    totalPages = branchesResponse.data.totalPages;
  }

  // Process stats data
  if (statsResponse.success && statsResponse.data) {
    branchStats = statsResponse.data;
  }

  // Filter branches by status if needed (client-side filtering)
  // Note: Ideally this would be done on the API, but we'll provide a fallback
  if (isActive !== undefined) {
    branches = branches.filter(branch => branch.isActive === isActive);
  }

  // Filter branches by search term if provided (client-side filtering)
  if (search) {
    const searchLower = search.toLowerCase();
    branches = branches.filter(branch => 
      branch.name.toLowerCase().includes(searchLower) || 
      branch.location.toLowerCase().includes(searchLower) ||
      branch.address.city.toLowerCase().includes(searchLower) ||
      branch.address.province.toLowerCase().includes(searchLower)
    );
  }

  // Calculate pagination details
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Branches</h1>
            <p className="text-muted-foreground">Manage and track your branches</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/branches/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            <Button asChild>
              <Link href="/branches/create">
                <Plus className="mr-2 h-4 w-4" /> New Branch
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{branchStats.numberOfBranches}</div>
              <p className="text-xs text-muted-foreground">
                All branches
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{branchStats.numberOfActiveBranches}</div>
              <p className="text-xs text-muted-foreground">Ready for operations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Branches</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{branchStats.numberOfInactiveBranches}</div>
              <p className="text-xs text-muted-foreground">Not currently in use</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned Users</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{branchStats.numberOfAssignedUsers}</div>
              <p className="text-xs text-muted-foreground">Total users assigned</p>
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-lg p-2">
          <BranchesFilters currentSearch={search} currentStatus={status} />

          <BranchesTable
            branches={branches}
            pagination={{
              totalItems,
              totalPages,
              currentPage: page,
              itemsPerPage: pageSize,
              startIndex,
              endIndex,
            }}
            searchParams={searchParams as Record<string, string>}
            currentSortField={sortField}
            currentSortDirection={sortDirection}
          />
        </div>
      </main>
    </div>
  )
}