"use client";

import "@/styles/globals.css";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  if (pathname === "/admin") return <>{children}</>;

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/blogs", label: "Blogs" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <nav style={{
        width: "200px",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        <h2 style={{ fontSize: "20px", marginBottom: "20px", fontFamily: "var(--serif)" }}>Admin</h2>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            style={{
              padding: "10px 16px",
              fontSize: "14px",
              fontWeight: "600",
              borderRadius: "8px",
              cursor: "pointer",
              border: "1px solid transparent",
              background: pathname === item.path ? "var(--blue)" : "transparent",
              color: pathname === item.path ? "#fff" : "var(--text2)",
              textAlign: "left"
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <main style={{ flex: 1, padding: "20px", background: "var(--bg)" }}>{children}</main>
    </div>
  );
}