"use client";

import backendApi from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await backendApi.get("/api/admin/blogs");
      setBlogs(response.data.blogs || []);
    } catch (err) {
      setError("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await backendApi.delete(`/api/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      alert("Failed to delete blog");
    }
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading...</div>;
  if (error) return <div style={{ padding: "40px", color: "var(--danger)" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: "28px", marginBottom: "20px" }}>
        Blog Management
      </h1>
      
      <button onClick={() => router.push("/admin/blogs/new")} className="btn-sm btn-blue" style={{ marginBottom: "20px" }}>
        Create New Blog
      </button>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {blogs.map((blog) => (
          <div
            key={blog._id}
            style={{
              background: "var(--surface)",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <strong>{blog.title}</strong>
              <div style={{ fontSize: "12px", color: "var(--text3)" }}>{blog.category}</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => router.push(`/admin/blogs/edit/${blog._id}`)} className="btn-sm btn-ghost">
                Edit
              </button>
              <button onClick={() => deleteBlog(blog._id)} className="btn-sm btn-danger">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}