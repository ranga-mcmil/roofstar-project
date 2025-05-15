import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Download, UserCheck, Users, UserMinus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
// import { users } from "@/lib/dummy-data"
import { UsersTable } from "./components/users-table"
import { UsersFilters } from "./components/users-filters"
import { GetUsersResponse, UserObj } from "@/lib/http-service/users/types"
import { getUsersAction } from "@/actions/users"

interface UsersPageProps {
  search?: string
  status?: string
  sortField?: string
  role?: string
  sortDirection?: "asc" | "desc"
  page?: string
}

export default async function UsersPage(props: {
  searchParams?: Promise<UsersPageProps>;
}) {
  const searchParams = await props.searchParams;

  // Parse search params
  const search = searchParams?.search || ""
  const status = searchParams?.status || "all"
  const role = searchParams?.status || "all"
  const sortField = searchParams?.sortField || "name"
  const sortDirection = (searchParams?.sortDirection || "asc") as "asc" | "desc"
  const page = Number.parseInt(searchParams?.page || "1", 10)
  const itemsPerPage = 2


  const response = await getUsersAction()
  let users: UserObj[] = []

  if (response.success) {
    users = response.data?.content as UserObj[]
  }


  console.log("  users ---->>>>  ", users)

  

  // Calculate pagination
  const totalItems = users.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
 
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-muted-foreground">Manage and track your users</p>
          </div>
          <div className="flex gap-2">
            <form action="/api/users/export" method="post">
              <Button type="submit" variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </form>
            <Button asChild>
              <Link href="/users/create">
                <Plus className="mr-2 h-4 w-4" /> New Users
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                All users
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">80% of total users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Roles</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1 / 2 / 2</div>
              <p className="text-xs text-muted-foreground">Admins / Managers / Sales Reps</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <UserMinus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground"> 20% of total users</p>
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-lg p-2">
          <UsersFilters currentSearch={search} currentStatus={status} role={role}/>

          <UsersTable
            users={users}
            pagination={{
              totalItems,
              totalPages,
              currentPage: page,
              itemsPerPage,
              startIndex,
              endIndex: Math.min(endIndex, totalItems),
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
