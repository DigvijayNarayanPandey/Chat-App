import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import LandingPage from "./pages/LandingPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import { Toaster } from "react-hot-toast";

const ChatPage = lazy(() => import("./pages/ChatPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const location = useLocation();

  // Apply saved theme globally on load
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Only show the full page loader if we're checking auth AND we are not on the landing page
  if (isCheckingAuth && location.pathname !== "/") return <PageLoader />;

  return (
    <div className="min-h-screen w-full bg-base-100 text-base-content relative flex flex-col overflow-hidden">
      {/* DECORATORS - GLOW SHAPES - Only render if not on the Terra-themed Landing Page to avoid background bleeding */}
      {window.location.pathname !== "/" && (
        <>
          <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] pointer-events-none" />
        </>
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/chat"
          element={
            <Suspense fallback={<PageLoader />}>
              {authUser ? <ChatPage /> : <Navigate to="/login" />}
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              {!authUser ? <LoginPage /> : <Navigate to="/chat" />}
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<PageLoader />}>
              {!authUser ? <SignUpPage /> : <Navigate to="/chat" />}
            </Suspense>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}
export default App;