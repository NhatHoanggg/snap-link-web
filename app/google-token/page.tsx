"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/services/auth";

export default function GoogleTokenPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);

    // Chỉ xử lý khi session đã được load xong
    if (status === "loading") return;

    if (status === "unauthenticated") {
      console.log("User is not authenticated");
      router.push("/login");
      return;
    }

    const idToken = session?.idToken;
    if (idToken) {
      console.log("idToken -->", idToken);
      const handleGoogleLogin = async () => {
        try {
          await loginWithGoogle(idToken);
          router.push("/home");
        } catch (error) {
          console.error("Error logging in with Google:", error);
          router.push("/auth/login");
        }
      };
      handleGoogleLogin();
    } else {
      console.log("No idToken found in session");
      router.push("/auth/login");
    }
  }, [session, status, router, loginWithGoogle]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
