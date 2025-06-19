'use client'
import { useState, useEffect } from 'react';
import BankSelect from '@/components/bank/bank-select';
import { Bank } from '@/types/bank';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { photographerService } from '@/services/photographer.service';

const PaymentPage = () => {
  const [selectedBank, setSelectedBank] = useState<Bank | undefined>();
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [defaultBankShortName, setDefaultBankShortName] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    photographerService.getMyPaymentInfo()
      .then((data) => {
        if (data && data.bank_name) {
          setAccountNumber(data.account_number || '');
          setDefaultBankShortName(data.bank_name);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Hàm lưu thông tin
  const handleSave = async () => {
    if (!selectedBank || !accountNumber) {
      setMessage('Vui lòng chọn ngân hàng và nhập số tài khoản');
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await photographerService.updateMyPaymentInfo({
        bank_name: selectedBank.shortName,
        account_number: accountNumber,
      });
      setMessage('Cập nhật thành công!');
    } catch {
      setMessage('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto pt-12">
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
                defaultBankShortName={defaultBankShortName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Số tài khoản *
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="Nhập số tài khoản"
                disabled={loading}
              />
            </div>
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={handleSave}
              disabled={saving || loading || !selectedBank || !accountNumber}
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
            {message && (
              <div className="mt-2 text-sm text-center text-blue-600">{message}</div>
            )}
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
                    <div>
                      <p className="font-medium text-gray-600">{selectedBank.shortName}</p>
                      <p className="text-gray-600">{selectedBank.name}</p>
                    </div>
                  </div>
                  {/* <div className="grid grid-cols-2 gap-4 mt-4">
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
                  </div> */}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;