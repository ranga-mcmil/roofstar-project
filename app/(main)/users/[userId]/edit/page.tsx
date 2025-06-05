import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserAction } from "@/actions/users"
import { GetUserResponse } from "@/lib/http-service/users/types"
import { UserFormClient } from "../../components/user-form-client"

interface EditUserPageProps {
  params: {
    userId: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { userId } = params;

  // Fetch user data
  const response = await getUserAction(userId);
  
  // Check for success and extract user data
  let user = undefined;
  if (response.success) {
    user = response.data as GetUserResponse;
  }

  // If user not found, return 404
  if (!user) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/users/${userId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit User: {user.firstName} {user.lastName}</h1>
            <p className="text-muted-foreground">Update user information</p>
          </div>
        </div>

        <Card className="p-6">
          <UserFormClient user={user} returnUrl={`/users/${userId}`} />
        </Card>
      </main>
    </div>
  )
}