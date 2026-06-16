import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl border border-slate-700/40"
           style={{ background: "linear-gradient(145deg,#172033,#1e293b)" }}>

        {/* ── LEFT — FORM ── */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
                <MessageCircleIcon className="w-7 h-7 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100 mb-1">Create Account</h1>
              <p className="text-slate-400 text-sm">Sign up for a new account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="auth-input-label">Full Name</label>
                <div className="relative">
                  <UserIcon className="auth-input-icon" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="auth-input"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button className="auth-btn" type="submit" disabled={isSigningUp}>
                {isSigningUp
                  ? <LoaderIcon className="w-5 h-5 animate-spin mx-auto" />
                  : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="auth-link">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT — ILLUSTRATION (hidden on mobile) ── */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 bg-gradient-to-bl from-slate-800/30 to-transparent border-l border-slate-700/30">
          <div className="text-center">
            <img
              src="/signup.png"
              alt="People using app"
              className="w-full max-w-xs h-auto object-contain mx-auto"
            />
            <h2 className="text-xl font-semibold text-cyan-400 mt-6">Start Your Journey Today</h2>
            <div className="mt-4 flex justify-center gap-3">
              <span className="auth-badge">Free</span>
              <span className="auth-badge">Easy Setup</span>
              <span className="auth-badge">Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignUpPage;
