// app/(main)/referral-payments/[id]/reject/page.tsx
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { updateReferralPaymentStatusAction } from "@/actions/referral-payments";
import { StatusChangeButton } from "../../components/status-change-button";

interface RejectPaymentPageProps {
  params: {
    id: string;
  };
}

export default async function RejectPaymentPage({ params }: RejectPaymentPageProps) {
  const id = parseInt(params.id, 10);
  
  // Server action to handle form submission
  async function rejectPayment() {
    "use server";
    
    const result = await updateReferralPaymentStatusAction(id, 'REJECTED');
    
    if (result.success) {
      redirect('/referral-payments?success=rejected');
    } else {
      redirect(`/referral-payments?error=${encodeURIComponent(result.error || "Failed to reject payment")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <X className="h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Reject Payment</CardTitle>
          <CardDescription>
            You are about to reject this referral payment.
            This action will decline the payment request.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Rejection will:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Mark the payment as rejected</li>
                <li>Prevent payment processing</li>
                <li>Send notification of rejection</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/referral-payments">Cancel</Link>
          </Button>
          <StatusChangeButton 
            action={rejectPayment} 
            label="Reject Payment"
            loadingLabel="Rejecting..."
            variant="destructive"
          />
        </CardFooter>
      </Card>
    </div>
  );
}