"use client";

import backendApi from "@/lib/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await backendApi.post('/api/auth/admin/login', { email, password });
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          isAdmin: response.data.isAdmin
        }));
        router.push("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: "28px", marginBottom: "20px" }}>Admin Login</h1>
      
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)", color: "var(--text)" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)", color: "var(--text)" }}
        />
        
        {error && <div style={{ color: "var(--danger)", fontSize: "14px" }}>{error}</div>}
        
        <button type="submit" disabled={loading} className="btn-full btn-blue">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}