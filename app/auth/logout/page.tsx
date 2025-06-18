"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const Logout = () => {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const timer = setInterval(() => {
      if (isMounted) {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTimeout(() => {
              router.push('/auth/login');
            }, 0);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [router]);

  const handleManualNavigation = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Đăng xuất thành công!
            </h1>
            <p className="text-gray-600 text-lg">
              Hẹn gặp lại bạn! 👋
            </p>
          </div>

          {/* Countdown */}
          <div className="mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">
                Tự động chuyển hướng sau
              </p>
              <div className="text-3xl font-bold text-blue-600">
                {countdown}
              </div>
              <p className="text-xs text-gray-400 mt-1">giây</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-blue-600 h-1 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Manual Navigation */}
          <button
            onClick={handleManualNavigation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200"
          >
            Đăng nhập ngay
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
        </p>
      </div>
    </div>
  );
};

export default Logout;