import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, KeyRound } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getUserAction } from "@/actions/users"
import { GetUserResponse } from "@/lib/http-service/users/types"
import { ChangePasswordFormClient } from "../../components/change-password-form"

interface ChangePasswordPageProps {
  params: {
    userId: string
  }
}

export default async function ChangePasswordPage({ params }: ChangePasswordPageProps) {
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
            <h1 className="text-2xl font-bold">
              <KeyRound className="inline-block mr-2 h-6 w-6" />
              Change Password: {user.name} {user.lastName}
            </h1>
            <p className="text-muted-foreground">Update user password</p>
          </div>
        </div>

        <Card className="p-6 max-w-md mx-auto">
          <ChangePasswordFormClient user={user} returnUrl={`/users/${userId}`} />
        </Card>
      </main>
    </div>
  )
}