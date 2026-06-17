import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-base-100 text-base-content">
      {/* ── LEFT — FORM ── */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
              <MessageCircleIcon className="w-7 h-7 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-base-content mb-1">Welcome Back</h1>
            <p className="text-base-content/60 text-sm">Login to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="auth-input-label">Email</label>
              <div className="relative">
                <MailIcon className="auth-input-icon" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="auth-input"
                  placeholder="johndoe@gmail.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="auth-input-label">Password</label>
              <div className="relative">
                <LockIcon className="auth-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="auth-input"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button className="auth-btn" type="submit" disabled={isLoggingIn}>
              {isLoggingIn
                ? <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
                : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/signup" className="auth-link">
              Don't have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* ── RIGHT — ILLUSTRATION (hidden on mobile) ── */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 bg-gradient-to-bl from-base-200/30 to-transparent border-l border-base-content/10">
        <div className="text-center">
          <img
            src="/login.png"
            alt="People chatting"
            className="w-full max-w-xs h-auto object-contain mx-auto"
          />
          <h2 className="text-xl font-semibold text-cyan-400 mt-6">Connect anytime, anywhere</h2>
          <div className="mt-4 flex justify-center gap-3">
            <span className="auth-badge">Free</span>
            <span className="auth-badge">Easy Setup</span>
            <span className="auth-badge">Private</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
