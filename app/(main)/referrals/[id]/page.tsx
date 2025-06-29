// app/(main)/referrals/[id]/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Edit, Printer, User, Phone, MapPin, DollarSign } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getReferralAction } from "@/actions/referrals"
import { GetReferralResponse } from "@/lib/http-service/referrals/types"

interface ReferralDetailsPageProps {
  params: {
    id: string
  }
  searchParams: {
    error?: string
  }
}

export default async function ReferralDetailsPage({ params, searchParams }: ReferralDetailsPageProps) {
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
        {/* Error message if present */}
        {searchParams.error && (
          <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200">
            <div className="flex items-center">
              {decodeURIComponent(searchParams.error)}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/referrals">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-bold">{referral.fullName}</h1>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{referral.phoneNumber}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link
                href={`/referrals/${id}/print`}
                target="_blank"
              >
                <Printer className="mr-2 h-4 w-4" /> Print
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/api/referrals/${id}/export`}
              >
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/referrals/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Link>
            </Button>
            <Button variant="destructive" asChild>
              <Link href={`/referrals/${id}/delete`}>
                Delete
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="w-4 h-4 mr-2" />
                Referral Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Full Name</div>
                  <div className="font-medium">{referral.fullName}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Phone Number</div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${referral.phoneNumber}`} className="hover:underline">
                      {referral.phoneNumber}
                    </a>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Address</div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>{referral.address || "No address provided"}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Referral ID</div>
                  <div className="text-sm font-mono text-muted-foreground">{referral.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Total Payments</div>
                  <div className="text-2xl font-bold">0</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Pending Payments</div>
                  <div className="text-lg font-medium">0</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Completed Payments</div>
                  <div className="text-lg font-medium text-green-600">0</div>
                </div>
                <div className="pt-2">
                  <Button variant="outline" asChild size="sm">
                    <Link href={`/referral-payments?referralId=${id}`}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      View Payments
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center gap-2">
                <Link href={`/referrals/phone/${encodeURIComponent(referral.phoneNumber)}`}>
                  <Phone className="h-5 w-5" />
                  <span className="text-sm">Phone Lookup</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center gap-2">
                <Link href={`/referral-payments?referralId=${id}`}>
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm">Payment History</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center gap-2">
                <Link href={`/orders/new?referralId=${id}`}>
                  <User className="h-5 w-5" />
                  <span className="text-sm">Create Order</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto p-4 flex flex-col items-center gap-2">
                <Link href={`/referrals/search?phone=${encodeURIComponent(referral.phoneNumber)}`}>
                  <Phone className="h-5 w-5" />
                  <span className="text-sm">Find Similar</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}