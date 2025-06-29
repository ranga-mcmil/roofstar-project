// app/(main)/referral-payments/[id]/mark-paid/page.tsx
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { updateReferralPaymentStatusAction } from "@/actions/referral-payments";
import { StatusChangeButton } from "../../components/status-change-button";

interface MarkPaidPageProps {
  params: {
    id: string;
  };
}

export default async function MarkPaidPage({ params }: MarkPaidPageProps) {
  const id = parseInt(params.id, 10);
  
  // Server action to handle form submission
  async function markAsPaid() {
    "use server";
    
    const result = await updateReferralPaymentStatusAction(id, 'PAID');
    
    if (result.success) {
      redirect('/referral-payments?success=paid');
    } else {
      redirect(`/referral-payments?error=${encodeURIComponent(result.error || "Failed to mark payment as paid")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <DollarSign className="h-16 w-16 text-blue-500 mb-2" />
          <CardTitle className="text-2xl">Mark as Paid</CardTitle>
          <CardDescription>
            You are about to mark this referral payment as paid.
            This confirms that the payment has been completed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 text-blue-800 rounded-md">
              <p className="font-medium">Marking as paid will:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Confirm payment completion</li>
                <li>Update payment status to paid</li>
                <li>Send confirmation notification</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/referral-payments">Cancel</Link>
          </Button>
          <StatusChangeButton 
            action={markAsPaid} 
            label="Mark as Paid"
            loadingLabel="Processing..."
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
          />
        </CardFooter>
      </Card>
    </div>
  );
}