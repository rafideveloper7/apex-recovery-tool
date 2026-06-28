"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthWrapper({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/auth" || pathname.startsWith("/admin")) return;
    
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/auth");
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [pathname, router]);

  return <>{children}</>;
}