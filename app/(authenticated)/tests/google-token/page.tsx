"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      console.log("User session:", session);
      console.log("Access token:", session?.accessToken);
    }
  }, [status, session]);
  

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>You are not logged in</p>;

  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      <p>Email: {session?.user?.email}</p>
      <p>Access token: {session?.accessToken}</p>
      <p>ID token: {session?.idToken}</p>
    </div>
  );
}
