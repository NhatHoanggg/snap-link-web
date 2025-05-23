'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const resultCode = searchParams.get('resultCode');
  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message');

  useEffect(() => {
    // You can add additional logic here to verify the payment status
    // with your backend if needed
  }, []);

  const isSuccess = resultCode === '0';

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-500 text-2xl">×</span>
              </div>
            )}
          </div>
          <CardTitle className="text-center">
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSuccess 
              ? 'Your payment has been processed successfully.'
              : message || 'There was an error processing your payment.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {orderId && (
            <div className="text-sm text-center text-gray-500">
              Order ID: {orderId}
            </div>
          )}
          <Button
            className="w-full"
            onClick={() => router.push('/')}
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
