// app/auth/callback/page.tsx - Optional file for a landing page/loading screen

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Processing Login...</h1>
      <p>Please wait, redirecting you back to the application.</p>
    </div>
  );
}
