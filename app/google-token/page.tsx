"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/services/auth";
import { useSearchParams } from "next/navigation";

export default function GoogleTokenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { loginWithGoogle } = useAuth();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async (role: string) => {
    try {
      setIsLoading(true);
      if (!session?.idToken) {
        throw new Error("No idToken found");
      }
      await loginWithGoogle(session.idToken, role);
      router.push("/home?role=" + role + "&first_login=true");
    } catch (error) {
      console.error("Error logging in with Google:", error);
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
    if (status === "loading") return;

    if (status === "unauthenticated") {
      console.log("User is not authenticated");
      router.push("/auth/login");
      return;
    }

    const idToken = session?.idToken;
    if (idToken) {
      console.log("idToken -->", idToken);
      
      const handleGoogleLogin = async () => {
        try {
          setIsLoading(true);
          const checkEmailResponse = await fetch("https://snaplink-itqaz.ondigitalocean.app/check-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session?.user?.email }),
          });

          const emailData = await checkEmailResponse.json();
          console.log("Email check response:", emailData);

          if (emailData.exists) {
            // Email exists, login with null role
            await loginWithGoogle(idToken, null);
            router.push("/home");
            return;
          }

          // Email doesn't exist, check for role
          const role = searchParams.get("role");
          
          if (!role) {
            // Show role selection UI
            setShowRoleSelection(true);
            return;
          }

          // Role exists, proceed with registration and login
          await loginWithGoogle(idToken, role);
          router.push("/home?role=" + role + "&first_login=true");
          
        } catch (error) {
          console.error("Error logging in with Google:", error);
          router.push("/auth/login");
        } finally {
          setIsLoading(false);
        }
      };

      handleGoogleLogin();
    } else {
      console.log("No idToken found in session");
      router.push("/auth/login");
    }
  }, [session, status, router, loginWithGoogle, searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-[--foreground] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[--primary] mb-4"></div>
        <p className="text-[--muted-foreground]">Đang xử lý...</p>
      </div>
    );
  }

  if (showRoleSelection) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[--foreground] p-4">
        <div className="text-[--card-foreground] p-8 rounded-2xl shadow-lg w-full max-w-md border border-[--border] space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Chọn vai trò của bạn</h2>
            <p className="text-[--muted-foreground]">Vui lòng chọn vai trò phù hợp với bạn</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelection("customer")}
              disabled={isLoading}
              className="hover:cursor-pointer w-full group relative overflow-hidden rounded-xl border border-[--border] bg-[--card] p-6 transition-all hover:border-[--primary] hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-[--primary]/10 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[--primary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[--card-foreground]">Khách hàng</h3>
                  <p className="text-sm text-[--muted-foreground]">Tìm kiếm và đặt lịch chụp ảnh</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelection("photographer")}
              disabled={isLoading}
              className="hover:cursor-pointer w-full group relative overflow-hidden rounded-xl border border-[--border] bg-[--card] p-6 transition-all hover:border-[--secondary] hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-[--secondary]/10 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[--secondary]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[--card-foreground]">Nhiếp ảnh gia</h3>
                  <p className="text-sm text-[--muted-foreground]">Cung cấp dịch vụ chụp ảnh chuyên nghiệp</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[--primary]"></div>
    </div>
  );
}
