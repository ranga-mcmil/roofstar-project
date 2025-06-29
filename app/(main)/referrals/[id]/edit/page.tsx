// app/(main)/referrals/[id]/edit/page.tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getReferralAction } from "@/actions/referrals"
import { GetReferralResponse } from "@/lib/http-service/referrals/types"
import { ReferralFormClient } from "../../components/referral-form-client"

interface EditReferralPageProps {
  params: {
    id: string
  }
}

export default async function EditReferralPage({ params }: EditReferralPageProps) {
  const id = parseInt(params.id, 10);

  // Fetch referral data
  const response = await getReferralAction(id);
  
  // Check for success and extract referral data
  let referral = undefined;
  if (response.success) {
    referral = response.data as GetReferralResponse;
  }

  // If referral not found, return 404
  if (!referral) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/referrals/${id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Referral: {referral.fullName}</h1>
            <p className="text-muted-foreground">Update referral information</p>
          </div>
        </div>

        <Card className="p-6">
          <ReferralFormClient 
            referral={referral} 
            returnUrl={`/referrals/${id}`} 
            isEditing={true}
          />
        </Card>
      </main>
    </div>
  )
}