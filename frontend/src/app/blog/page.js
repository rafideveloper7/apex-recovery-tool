"use client";

import backendApi from "../../lib/api";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await backendApi.get('/blogs', { params: { category: filter } });
        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [filter]);

  const categories = [
    { key: "all", label: "All Articles" },
    { key: "burnout", label: "🔥 Burnout" },
    { key: "sleep", label: "🌙 Sleep" },
    { key: "recovery", label: "💚 Recovery" },
    { key: "workplace", label: "💼 Workplace" },
  ];

  return (
    <>
      <style>{`
        .blog-card{background:#fff;border:1px solid var(--border);border-radius:18px;overflow:hidden;margin-bottom:16px;cursor:pointer;transition:box-shadow .2s,transform .18s}
        .blog-card:hover{border-color:#4B7BE5;box-shadow:0 6px 28px rgba(75,123,229,.13);transform:translateY(-2px)}
        .blog-card-img{height:148px;display:flex;align-items:center;justify-content:center;font-size:68px;position:relative;overflow:hidden}
        .blog-card-body{padding:18px 20px 20px}
        .blog-tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.3px;margin-bottom:10px}
        .blog-card-title{font-family:var(--serif);font-size:18px;color:var(--text);margin-bottom:8px;line-height:1.38}
        .blog-card-excerpt{font-size:13.5px;color:var(--text3);line-height:1.7;margin-bottom:14px}
        .blog-card-meta{font-size:11.5px;color:var(--text3);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .blog-card-read{font-size:12px;font-weight:700;color:#4B7BE5;display:flex;align-items:center;gap:4px;white-space:nowrap}
      `}</style>

      <div className="ins-hero" style={{ background: "linear-gradient(135deg,#0D1B3E 0%,#1A2B52 60%,#0F3460 100%)" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📰</div>
            <h2 style={{ fontSize: "22px", color: "#fff", fontFamily: "var(--serif)" }}>Burnout Recovery Blog</h2>
          </div>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: "14px", lineHeight: "1.65", marginBottom: "14px" }}>Evidence-based articles on burnout, workplace wellness, sleep science, and mental performance — written for people who push hard.</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <span key={cat.key} style={{ background: "rgba(255,255,255,.1)", borderRadius: "20px", padding: "5px 12px", fontSize: "11px", color: "rgba(255,255,255,.7)", cursor: "pointer" }} onClick={() => setFilter(cat.key)}>
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="content" id="blog-grid">
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text3)" }}>Loading articles...</div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text3)" }}>No articles found. Check back later!</div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-card" onClick={() => window.location.href = `/blog/${blog.slug}`}>
              <div className="blog-card-img">{blog.heroEmoji || "📰"}</div>
              <div className="blog-card-body">
                <span className={`blog-tag ${blog.category === "burnout" ? "badge-red" : blog.category === "sleep" ? "badge-blue" : blog.category === "recovery" ? "badge-green" : "badge-blue"}`}>
                  {blog.category}
                </span>
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{blog.excerpt}</p>
                <div className="blog-card-meta">
                  <span>5 min read</span>
                  <Link href={`/blog/${blog.slug}`} className="blog-card-read">Read article →</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}