// app/(main)/referral-payments/[id]/approve/page.tsx
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { updateReferralPaymentStatusAction } from "@/actions/referral-payments";
import { StatusChangeButton } from "../../components/status-change-button";

interface ApprovePaymentPageProps {
  params: {
    id: string;
  };
}

export default async function ApprovePaymentPage({ params }: ApprovePaymentPageProps) {
  const id = parseInt(params.id, 10);
  
  // Server action to handle form submission
  async function approvePayment() {
    "use server";
    
    const result = await updateReferralPaymentStatusAction(id, 'APPROVED');
    
    if (result.success) {
      redirect('/referral-payments?success=approved');
    } else {
      redirect(`/referral-payments?error=${encodeURIComponent(result.error || "Failed to approve payment")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Check className="h-16 w-16 text-green-500 mb-2" />
          <CardTitle className="text-2xl">Approve Payment</CardTitle>
          <CardDescription>
            You are about to approve this referral payment.
            This will allow the payment to be processed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-green-50 text-green-800 rounded-md">
              <p className="font-medium">Approval will:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Mark the payment as approved</li>
                <li>Allow the payment to be processed</li>
                <li>Send notification to relevant parties</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/referral-payments">Cancel</Link>
          </Button>
          <StatusChangeButton 
            action={approvePayment} 
            label="Approve Payment"
            loadingLabel="Approving..."
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          />
        </CardFooter>
      </Card>
    </div>
  );
}