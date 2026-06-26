"use client";

import backendApi from "../../lib/api";
import { useState } from "react";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", slug: "", excerpt: "", content: "", category: "all", heroEmoji: "📰" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await backendApi.post('/auth/login', { email, password });
      localStorage.setItem("token", response.data.token);
      if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAuthenticated(true);
        fetchBlogs();
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await backendApi.get('/blogs', { headers: { Authorization: `Bearer ${token}` } });
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const createBlog = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await backendApi.post('/blogs', newBlog, { headers: { Authorization: `Bearer ${token}` } });
      setNewBlog({ title: "", slug: "", excerpt: "", content: "", category: "all", heroEmoji: "📰" });
      fetchBlogs();
    } catch (error) {
      alert("Error creating blog");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      const token = localStorage.getItem("token");
      await backendApi.delete(`/blogs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchBlogs();
    } catch (error) {
      alert("Error deleting blog");
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "40px", maxWidth: "400px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "28px", marginBottom: "20px" }}>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px" }} 
              required 
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600" }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "8px" }} 
              required 
            />
          </div>
          <button type="submit" className="btn-full btn-blue">Login</button>
        </form>
        <p style={{ marginTop: "12px", fontSize: "12px", color: "var(--text3)" }}>Admin access only. Use the email from backend .env</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: "28px", marginBottom: "20px" }}>Blog Admin</h1>
      
      <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "20px", border: "1px solid var(--border)" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>Create New Blog Post</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          <input 
            placeholder="Title" 
            value={newBlog.title} 
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} 
            style={{ padding: "10px", border: "1px solid var(--border)", borderRadius: "6px" }} 
          />
          <input 
            placeholder="Slug (url-friendly)" 
            value={newBlog.slug} 
            onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })} 
            style={{ padding: "10px", border: "1px solid var(--border)", borderRadius: "6px" }} 
          />
          <input 
            placeholder="Hero Emoji" 
            value={newBlog.heroEmoji} 
            onChange={(e) => setNewBlog({ ...newBlog, heroEmoji: e.target.value })} 
            style={{ padding: "10px", border: "1px solid var(--border)", borderRadius: "6px" }} 
          />
          <select 
            value={newBlog.category} 
            onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })} 
            style={{ padding: "10px", border: "1px solid var(--border)", borderRadius: "6px" }}
          >
            <option value="all">All</option>
            <option value="burnout">Burnout</option>
            <option value="sleep">Sleep</option>
            <option value="recovery">Recovery</option>
            <option value="workplace">Workplace</option>
          </select>
          <textarea 
            placeholder="Excerpt" 
            value={newBlog.excerpt} 
            onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })} 
            style={{ padding: "10px", border: "1px solid var(--border)", borderRadius: "6px", minHeight: "80px" }} 
          />
          <textarea 
            placeholder="Content (HTML or text)" 
            value={newBlog.content} 
            onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} 
            style={{ padding: "10px", border: "1px solid var(--border)", borderRadius: "6px", minHeight: "120px" }} 
          />
          <button onClick={createBlog} disabled={loading} className="btn-full btn-blue">Create Blog</button>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "18px", marginBottom: "12px" }}>Existing Posts</h2>
        {blogs.map((blog) => (
          <div key={blog._id} style={{ background: "#fff", padding: "16px", borderRadius: "8px", marginBottom: "10px", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{blog.title}</strong>
              <div style={{ fontSize: "12px", color: "var(--text3)" }}>/{blog.slug}</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn-sm btn-ghost">Edit</button>
              <button onClick={() => deleteBlog(blog._id)} className="btn-sm btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}