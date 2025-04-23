"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/lib/auth";

export default function GoogleTokenPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const idToken = session?.idToken;
    if (idToken) {
      const handleGoogleLogin = async () => {
        try {
          await loginWithGoogle(idToken);
          router.push("/home");
        } catch (error) {
          console.error("Error logging in with Google:", error);
          router.push("/login");
        }
      };
      handleGoogleLogin();
    } else {
      router.push("/login");
    }
  }, [session, router, loginWithGoogle]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
} 