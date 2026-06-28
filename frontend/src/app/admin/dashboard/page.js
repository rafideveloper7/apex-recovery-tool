"use client";

import backendApi from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    blogs: 0,
    chats: 0,
    dataPoints: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }
      try {
        const response = await backendApi.get("/api/auth/me");
        if (!response.data?.user?.isAdmin) {
          router.push("/admin");
        }
      } catch {
        router.push("/admin");
      }
    };
    checkAdmin();
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const response = await backendApi.get("/api/admin/stats");
      setStats(response.data.stats || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin");
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "28px" }}>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn-sm btn-danger">Logout</button>
      </div>

      <div style={{ display: "grid", gap: "16px" }}>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "14px", color: "var(--text3)" }}>Total Users</div>
          <div style={{ fontSize: "32px", fontWeight: "700" }}>{stats.users}</div>
          <button onClick={() => router.push("/admin/users")} className="btn-sm btn-blue" style={{ marginTop: "10px" }}>
            Manage Users
          </button>
        </div>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "14px", color: "var(--text3)" }}>Total Blogs</div>
          <div style={{ fontSize: "32px", fontWeight: "700" }}>{stats.blogs}</div>
          <button onClick={() => router.push("/admin/blogs")} className="btn-sm btn-blue" style={{ marginTop: "10px" }}>
            Manage Blogs
          </button>
        </div>
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: "14px", color: "var(--text3)" }}>Chat Messages</div>
          <div style={{ fontSize: "32px", fontWeight: "700" }}>{stats.chats}</div>
        </div>
      </div>
    </div>
  );
}