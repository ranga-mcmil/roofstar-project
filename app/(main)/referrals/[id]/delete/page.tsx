// app/(main)/referrals/[id]/delete/page.tsx
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteReferralAction, getReferralAction } from "@/actions/referrals";
import { GetReferralResponse } from "@/lib/http-service/referrals/types";
import { APIResponse } from "@/lib/http-service/apiClient";
import { DeleteButton } from "../../components/delete-button";

interface DeleteReferralPageProps {
  params: {
    id: string;
  };
}

export default async function DeleteReferralPage({ params }: DeleteReferralPageProps) {
  const id = parseInt(params.id, 10);
  
  // Get referral details first
  const referralResponse: APIResponse<GetReferralResponse> = await getReferralAction(id);
  
  // If referral not found, show 404
  if (!referralResponse.success || !referralResponse.data) {
    notFound();
  }
  
  const referral: GetReferralResponse = referralResponse.data;
  
  // Create a form action that uses the existing deleteReferralAction
  async function handleDelete() {
    "use server";
    
    const result = await deleteReferralAction(id);
    
    if (result.success) {
      redirect('/referrals?deleted=true');
    } else {
      redirect(`/referrals?error=${encodeURIComponent(result.error || "Failed to delete referral")}`);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 flex flex-col items-center text-center">
          <Trash2 className="h-16 w-16 text-red-500 mb-2" />
          <CardTitle className="text-2xl">Delete Referral</CardTitle>
          <CardDescription>
            You are about to permanently delete the referral for "{referral.fullName}".
            This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-red-50 text-red-800 rounded-md">
              <p className="font-medium">Warning:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All referral information will be permanently deleted</li>
                <li>Associated payment records will be affected</li>
                <li>This operation cannot be reversed</li>
              </ul>
            </div>
            
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md mt-2">
              <p className="font-medium">Referral Details:</p>
              <p className="text-sm mt-1">
                <strong>Name:</strong> {referral.fullName}<br />
                <strong>Phone:</strong> {referral.phoneNumber}<br />
                {referral.address && <><strong>Address:</strong> {referral.address}</>}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/referrals/${id}`}>Cancel</Link>
          </Button>
          <DeleteButton deleteAction={handleDelete} />
        </CardFooter>
      </Card>
    </div>
  );
}
