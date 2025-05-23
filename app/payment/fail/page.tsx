import Link from "next/link"
import { XCircle, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function PaymentFail() {
  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Thanh toán thất bại!</h1>
        <p className="text-gray-500 max-w-md">
          Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Thông tin lỗi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mã lỗi</p>
                  <p className="font-medium">PAYMENT_FAILED</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời gian</p>
                  <p className="font-medium">{new Date().toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                  <p className="font-medium">Thẻ tín dụng</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p className="font-medium text-red-600">Thất bại</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Hướng dẫn</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Kiểm tra lại thông tin thẻ thanh toán của bạn</li>
                <li>Đảm bảo số dư tài khoản đủ để thanh toán</li>
                <li>Thử lại với phương thức thanh toán khác</li>
                <li>Liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/payment" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay lại trang thanh toán
            </Link>
          </Button>
          <Button asChild>
            <Link href="/support">
              Liên hệ hỗ trợ
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
