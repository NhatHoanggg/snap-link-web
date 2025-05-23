import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createMomoPayment, MomoPaymentRequest, MomoPaymentType } from '@/services/payment.service';
import { useToast } from "@/components/ui/use-toast";

interface MomoPaymentProps {
  amount: number;
  orderId: string;
  orderInfo: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function MomoPayment({ amount, orderId, orderInfo, onSuccess, onError }: MomoPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<MomoPaymentType>(MomoPaymentType.CAPTURE_WALLET);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      const paymentData: MomoPaymentRequest = {
        amount,
        order_id: orderId,
        order_info: orderInfo,
        return_url: `${window.location.origin}/payment/success`,
        notify_url: `${process.env.NEXT_PUBLIC_API_URL}/api/payment/momo/callback`,
        payment_type: paymentType
      };

      const response = await createMomoPayment(paymentData);
      
      if (response.resultCode === 0) {
        // Redirect to MoMo payment page
        window.location.href = response.payUrl;
        onSuccess?.();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input
          type="text"
          value={`${amount.toLocaleString('vi-VN')} VND`}
          disabled
        />
      </div>
      
      <div className="space-y-2">
        <Label>Order Information</Label>
        <Input
          type="text"
          value={orderInfo}
          disabled
        />
      </div>

      <div className="space-y-2">
        <Label>Payment Method</Label>
        <RadioGroup
          value={paymentType}
          onValueChange={(value) => setPaymentType(value as MomoPaymentType)}
          className="grid grid-cols-1 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MomoPaymentType.CAPTURE_WALLET} id="wallet" />
            <Label htmlFor="wallet">Ví MoMo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MomoPaymentType.PAY_WITH_ATM} id="atm" />
            <Label htmlFor="atm">Thẻ ATM nội địa</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={MomoPaymentType.PAY_WITH_CC} id="cc" />
            <Label htmlFor="cc">Thẻ quốc tế (Visa/Mastercard)</Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        className="w-full"
        onClick={handlePayment}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Pay with MoMo"}
      </Button>
    </div>
  );
} 