"use client";

import backendApi from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const onboardingQuestions = [
  {
    id: "burnoutFrequency",
    question: "How often do you feel mentally exhausted from work?",
    options: ["Almost daily", "Several times a week", "Once a week", "Rarely", "Never"]
  },
  {
    id: "sleepHours",
    question: "How many hours of sleep do you typically get?",
    options: ["Less than 5", "5-6 hours", "6-7 hours", "7-8 hours", "More than 8"]
  },
  {
    id: "stressLevel",
    question: "What's your current stress level?",
    options: ["Very high", "High", "Moderate", "Low", "Very low"]
  },
  {
    id: "workplaceSupport",
    question: "How supported do you feel at work?",
    options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"]
  },
  {
    id: "recoveryTime",
    question: "How much time do you dedicate to recovery daily?",
    options: ["None", "15-30 min", "30-60 min", "1-2 hours", "More than 2 hours"]
  }
];

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profileImage: null,
    onboardingAnswers: {}
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result.length > 5 * 1024 * 1024) {
          alert("Image too large. Please select a smaller image.");
          return;
        }
        setFormData({ ...formData, profileImage: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setFormData({
      ...formData,
      onboardingAnswers: {
        ...formData.onboardingAnswers,
        [questionId]: answer
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const response = await backendApi.post(endpoint, formData);
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          profileImage: response.data.profileImage,
          onboardingAnswers: response.data.onboardingAnswers
        }));
        document.cookie = `token=${response.data.token}; path=/; max-age=604800`;
        router.push("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {preview && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img 
            src={preview} 
            alt="Profile preview" 
            style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--border)" }}
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg3)", color: "var(--text)" }}
      />
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)", color: "var(--text)" }}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
        style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)", color: "var(--text)" }}
      />
      <input
        type="password"
        placeholder="Password (min 6 characters)"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        minLength={6}
        style={{ padding: "12px", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--bg)", color: "var(--text)" }}
      />
    </div>
  );

  const renderOnboarding = (question, index) => (
    <div key={question.id} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)" }}>{question.question}</h3>
      {question.options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => handleAnswer(question.id, option)}
          style={{
            padding: "12px",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            background: formData.onboardingAnswers[question.id] === option ? "var(--blue)" : "var(--bg3)",
            color: formData.onboardingAnswers[question.id] === option ? "#fff" : "var(--text)",
            cursor: "pointer",
            textAlign: "left"
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "0 auto", minHeight: "100vh" }}>
      <h1 style={{ fontFamily: "var(--serif)", fontSize: "28px", marginBottom: "30px", textAlign: "center" }}>
        {isLogin ? "Welcome Back" : "Create Account"}
      </h1>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderOnboarding(onboardingQuestions[0], 0)}
        {step === 3 && renderOnboarding(onboardingQuestions[1], 1)}
        {step === 4 && renderOnboarding(onboardingQuestions[2], 2)}
        {step === 5 && renderOnboarding(onboardingQuestions[3], 3)}
        {step === 6 && renderOnboarding(onboardingQuestions[4], 4)}
        
        <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
          {step > 1 && step <= 6 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-sm btn-ghost"
            >
              Back
            </button>
          )}
          {step < 6 && step >= 1 && (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && (!formData.name || !formData.email || !formData.password)}
              className="btn-sm btn-blue"
              style={{ flex: 1 }}
            >
              Next
            </button>
          )}
          {step === 6 && !isLogin && (
            <button
              type="submit"
              disabled={loading || Object.keys(formData.onboardingAnswers).length < 5}
              className="btn-full btn-blue"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          )}
          {step === 1 && isLogin && (
            <button
              type="submit"
              disabled={loading}
              className="btn-full btn-blue"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          )}
        </div>
      </form>

      <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "var(--text3)" }}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => { setIsLogin(!isLogin); setStep(1); }}
          style={{ background: "none", border: "none", color: "var(--blue)", marginLeft: "8px", cursor: "pointer", fontWeight: "600" }}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}