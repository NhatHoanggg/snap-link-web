'use client'
import { useState } from 'react';
import BankSelect from '@/components/bank/bank-select';
import { Bank } from '@/types/bank';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import Image from 'next/image';

const Index = () => {
  const [selectedBank, setSelectedBank] = useState<Bank | undefined>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn Ngân Hàng
          </h1>
          <p className="text-xl text-gray-600">
            Demo component chọn ngân hàng với dữ liệu từ VietQR API
          </p>
        </div>

        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Thông tin ngân hàng</CardTitle>
            <CardDescription>
              Chọn ngân hàng từ danh sách các ngân hàng tại Việt Nam
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ngân hàng *
              </label>
              <BankSelect
                value={selectedBank}
                onValueChange={setSelectedBank}
                placeholder="Chọn ngân hàng của bạn..."
              />
            </div>

            {selectedBank && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Thông tin ngân hàng đã chọn:
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedBank.logo}
                      alt={selectedBank.shortName}
                      className="w-12 h-12 object-contain rounded"
                    />
                    {/* <Image
                        src={selectedBank.logo}
                        alt={selectedBank.shortName}
                        className="object-contain rounded"
                        width={48}
                        height={48}
                    /> */}
                    <div>
                      <p className="font-medium">{selectedBank.shortName}</p>
                      <p className="text-gray-600">{selectedBank.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="font-medium">Mã ngân hàng:</span>
                      <span className="ml-2">{selectedBank.code}</span>
                    </div>
                    <div>
                      <span className="font-medium">BIN:</span>
                      <span className="ml-2">{selectedBank.bin}</span>
                    </div>
                    <div>
                      <span className="font-medium">Hỗ trợ chuyển khoản:</span>
                      <span className="ml-2">
                        {selectedBank.transferSupported ? '✅' : '❌'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Hỗ trợ tra cứu:</span>
                      <span className="ml-2">
                        {selectedBank.lookupSupported ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;