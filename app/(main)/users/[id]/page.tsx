import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Edit, Mail, MapPin, User } from "lucide-react"
import { StatusChangeButton } from "../components/status-change-button"
import { getUserAction } from "@/actions/users"
import { GetUserResponse } from "@/lib/http-service/users/types"

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const userId = params.id
  
  const response = await getUserAction(userId)

  let user = undefined
  
  if (response.success) {
    user = response.data as GetUserResponse
  }


  // Fetch warehouse data directly from dummy data
  // const warehouse = warehouses.find((w) => w.id === warehouseId)

  if (!user) {
    notFound()
  }


  // Get role display
  const roleDisplay =
    {
      admin: "Administrator",
      store_manager: "Store Manager",
      sales_rep: "Sales Representative",
    }[user.role] || user.role

  // Get role badge color
  const getRoleBadge = () => {
    switch (user.role) {
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>
      case "store_manager":
        return <Badge className="bg-blue-500">Store Manager</Badge>
      case "sales_rep":
        return <Badge className="bg-green-500">Sales Rep</Badge>
      default:
        return <Badge variant="outline">{user.role}</Badge>
    }
  }

  // Get status badge color
  const getStatusBadge = () => {
    switch (user.status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="outline">{user.status}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/users">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          {getRoleBadge()}
          {getStatusBadge()}
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Basic information about the user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Name</div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Role</div>
                  <div>{roleDisplay}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div>{user.status === "active" ? "Active" : "Inactive"}</div>
                </div>
                {user.warehouseName && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Assigned Warehouse</div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{user.warehouseName}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:w-80">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>User account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Created</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>--- -- - -- </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>---- -- - -- </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Last Login</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>--- -- -</span>
                </div>
              </div>
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full">
                  <Link href={`/users/edit/${user.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit User
                  </Link>
                </Button>
                <StatusChangeButton userId={user.id} currentStatus={user.status} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
