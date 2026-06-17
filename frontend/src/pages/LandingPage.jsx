import { useEffect } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import {
  MessageCircle,
  ArrowRight,
  User,
  MoreVertical,
  Lock,
  Send,
  ShieldCheck,
  Leaf,
  Sparkles,
  Flower,
  Cloud,
  Grid
} from "lucide-react";

function LandingPage() {
  const { authUser } = useAuthStore();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="terra-landing min-h-screen flex flex-col bg-[#fdfcf9] text-[#1a1c19] selection:bg-[#d7e8de] selection:text-[#072111] overflow-x-hidden">
      <style>{`
        .terra-landing {
          font-family: 'Nunito Sans', sans-serif;
        }
        .hero-gradient-terra {
          background: radial-gradient(circle at top right, rgba(74, 124, 89, 0.12), transparent 50%),
                      radial-gradient(circle at bottom left, rgba(226, 228, 217, 0.4), transparent 50%);
        }
        .shadow-terra {
          box-shadow: 0 20px 40px -12px rgba(74, 124, 89, 0.08);
        }
        .mockup-inner-shadow {
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
        }
      `}</style>

      {/* ── TOP APP BAR ── */}
      <header className="fixed top-0 w-full z-50 bg-[#fdfcf9]/80 backdrop-blur-xl border-b border-[#c2c9bf]/30">
        <nav className="flex justify-between items-center h-20 px-5 md:px-16 max-w-[1280px] mx-auto">
          <div className="flex items-center gap-1">
            <div className="w-9 h-9 rounded-xl bg-[#d7e8de] flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-[#4a7c59]" />
            </div>
            <span className="font-sans text-xl font-extrabold tracking-tight text-[#4a7c59]">Chatty</span>
          </div>

          <Link
            to={authUser ? "/chat" : "/login"}
            className="bg-[#4a7c59] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#3d664a] active:scale-95 transition-all duration-200 shadow-md shadow-[#4a7c59]/10"
          >
            {authUser ? "Go to Chat" : "Get Started"}
          </Link>
        </nav>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow pt-20">
        {/* ── HERO SECTION ── */}
        <section className="hero-gradient-terra px-5 py-16 md:py-24 flex flex-col items-center text-center relative overflow-hidden">
          <div className="max-w-xl mx-auto mt-4 animate-on-scroll transition-all duration-700 opacity-0 translate-y-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-tight text-[#1a1c19]">
              Simple. Secure. <br className="hidden sm:inline" /> Messaging.
            </h1>
            <p className="text-lg md:text-xl text-[#424941] mb-8 max-w-lg mx-auto leading-relaxed">
              Experience crystal clear, private conversations. A serene space for your most important connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to={authUser ? "/chat" : "/login"}
                className="w-full sm:w-auto h-[52px] px-8 bg-[#4a7c59] text-white rounded-full font-bold flex items-center justify-center shadow-lg shadow-[#4a7c59]/20 hover:bg-[#3d664a] active:scale-[0.98] transition-all"
              >
                {authUser ? "Go to Chat Dashboard" : "Download Chatty"}
              </Link>
              <Link
                to={authUser ? "/chat" : "/login"}
                className="font-bold text-[#4a7c59] hover:underline underline-offset-4 flex items-center gap-1.5 py-2"
              >
                Discover the Difference <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ── MOCKUP SCREEN (Terra Theme) ── */}
          <div className="relative w-full max-w-[340px] mx-auto mt-8 group animate-on-scroll transition-all duration-1000 opacity-0 translate-y-8">
            <div className="absolute inset-0 bg-[#d7e8de]/40 blur-3xl -z-10 rounded-full scale-125"></div>
            <div className="bg-[#e2e3db] rounded-[48px] p-3 border-4 border-white/80 shadow-2xl shadow-[#4a7c59]/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
              <div className="bg-[#fdfcf9] rounded-[36px] h-[540px] flex flex-col relative overflow-hidden mockup-inner-shadow">

                {/* Mockup Header */}
                <div className="px-4 py-4 flex items-center justify-between border-b border-[#c2c9bf]/30 bg-[#fdfcf9]/95 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d7e8de] flex items-center justify-center">
                      <User className="w-5 h-5 text-[#4a7c59]" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-[#1a1c19] font-bold leading-none">Serenity Bot</p>
                      <p className="text-[11px] text-[#4a7c59] font-semibold mt-1">Earthy Privacy</p>
                    </div>
                  </div>
                  <MoreVertical className="w-5 h-5 text-[#424941]" />
                </div>

                {/* Mockup Chat Body */}
                <div className="flex-grow p-4 flex flex-col gap-3 overflow-y-auto no-scrollbar">
                  <div className="self-center py-1 px-3 bg-[#f4f4ec] rounded-full mb-2 border border-[#c2c9bf]/10">
                    <p className="text-[10px] uppercase font-extrabold text-[#4a7c59] tracking-widest flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Rooted Encryption
                    </p>
                  </div>

                  {/* Receiver */}
                  <div className="bg-[#e8e9e1] rounded-2xl rounded-bl-none p-3 max-w-[85%] self-start border border-[#c2c9bf]/20">
                    <p className="text-sm text-[#1a1c19] leading-relaxed">
                      Welcome to Chatty. Experience the peace of private messaging.
                    </p>
                  </div>

                  {/* Sender */}
                  <div className="bg-[#4a7c59] text-white rounded-2xl rounded-br-none p-3 max-w-[85%] self-end shadow-sm">
                    <p className="text-sm leading-relaxed">Tell me about the encryption.</p>
                  </div>

                  {/* Receiver */}
                  <div className="bg-[#e8e9e1] rounded-2xl rounded-bl-none p-3 max-w-[85%] self-start border border-[#c2c9bf]/20">
                    <p className="text-sm text-[#1a1c19] leading-relaxed">
                      Every word is protected like a seedling in fertile soil, visible only to you.
                    </p>
                  </div>
                </div>

                {/* Mockup Input */}
                <div className="p-4 bg-[#ffffff] border-t border-[#c2c9bf]/20">
                  <div className="h-12 bg-[#eeeee7] rounded-full flex items-center px-4 justify-between border border-[#c2c9bf]/30">
                    <span className="text-[#424941]/55 text-sm">Plant a thought...</span>
                    <Send className="w-4 h-4 text-[#4a7c59] fill-[#4a7c59]" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <section className="bg-[#f4f4ec] py-8 border-y border-[#c2c9bf]/20 overflow-x-auto whitespace-nowrap no-scrollbar">
          <div className="flex justify-center items-center gap-12 px-6 min-w-max mx-auto animate-on-scroll transition-all duration-700 opacity-0 translate-y-8">
            <div className="flex items-center gap-2 text-[#424941]">
              <ShieldCheck className="w-5 h-5 text-[#4a7c59]" />
              <span className="font-bold text-sm tracking-wide">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-[#424941]">
              <Leaf className="w-5 h-5 text-[#4a7c59]" />
              <span className="font-bold text-sm tracking-wide">Ad-Free Serenity</span>
            </div>
            <div className="flex items-center gap-2 text-[#424941]">
              <Sparkles className="w-5 h-5 text-[#4a7c59]" />
              <span className="font-bold text-sm tracking-wide">Open Transparency</span>
            </div>
          </div>
        </section>

        {/* ── FEATURES SECTION ── */}
        <section className="px-5 py-20 space-y-8 max-w-[600px] mx-auto">
          <div className="text-center mb-12 animate-on-scroll transition-all duration-700 opacity-0 translate-y-8">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-[#1a1c19]">Designed and Developed by Digvijay</h2>
          </div>

          {/* Feature Card 1 */}
          <div className="p-8 bg-[#ffffff] rounded-3xl border border-[#c2c9bf]/40 hover:border-[#4a7c59]/30 transition-all duration-300 shadow-terra animate-on-scroll transition-all duration-700 opacity-0 translate-y-8">
            <div className="w-12 h-12 rounded-2xl bg-[#d7e8de] flex items-center justify-center mb-4">
              <Flower className="w-6 h-6 text-[#4a7c59]" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#1a1c19]">Naturally Private</h3>
            <p className="text-sm text-[#424941] leading-relaxed">
              Your history belongs to you. We've removed the digital footprints, leaving only your connection.
            </p>
          </div>

          {/* Feature Card 2 */}
          <div className="p-8 bg-[#ffffff] rounded-3xl border border-[#c2c9bf]/40 hover:border-[#4a7c59]/30 transition-all duration-300 shadow-terra animate-on-scroll transition-all duration-700 opacity-0 translate-y-8">
            <div className="w-12 h-12 rounded-2xl bg-[#d7e8de] flex items-center justify-center mb-4">
              <Cloud className="w-6 h-6 text-[#4a7c59]" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#1a1c19]">Effortless Flow</h3>
            <p className="text-sm text-[#424941] leading-relaxed">
              Experience instant delivery through a grounded, decentralized network that moves as naturally as the wind.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="p-8 bg-[#ffffff] rounded-3xl border border-[#c2c9bf]/40 hover:border-[#4a7c59]/30 transition-all duration-300 shadow-terra animate-on-scroll transition-all duration-700 opacity-0 translate-y-8">
            <div className="w-12 h-12 rounded-2xl bg-[#d7e8de] flex items-center justify-center mb-4">
              <Grid className="w-6 h-6 text-[#4a7c59]" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#1a1c19]">Zero Clutter</h3>
            <p className="text-sm text-[#424941] leading-relaxed">
              A minimalist interface that breathes. No stickers, no noise—just pure, unadulterated human dialogue.
            </p>
          </div>
        </section>

        {/* ── FINAL CTA SECTION ── */}
        <section className="px-5 py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto bg-[#4a7c59] text-white rounded-[40px] p-8 md:p-16 text-center flex flex-col items-center gap-6 overflow-hidden relative shadow-xl shadow-[#4a7c59]/15">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full opacity-20 blur-3xl"></div>

            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight z-10">
              Ready for a lighter way to chat?
            </h2>
            <p className="text-base md:text-lg text-[#d7e8de] max-w-sm opacity-90 z-10 leading-relaxed">
              Join the thousands who have found their digital sanctuary with Chatty.
            </p>

            <Link
              to={authUser ? "/chat" : "/signup"}
              className="mt-4 px-8 py-4 bg-[#fdfcf9] text-[#4a7c59] rounded-full font-extrabold hover:bg-white active:scale-95 transition-all shadow-lg z-10"
            >
              {authUser ? "Go to Chat Page" : "Get Chatty for Free"}
            </Link>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full bg-[#f4f4ec] border-t border-[#c2c9bf]/20 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-5 md:px-16 max-w-[1280px] mx-auto gap-6">
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-6 h-6 text-[#4a7c59]" />
            <span className="font-sans text-lg text-[#4a7c59] font-extrabold tracking-tight">Chatty</span>
          </div>

          <nav className="flex gap-6">
            <a className="text-sm text-[#424941] hover:text-[#4a7c59] transition-colors cursor-pointer" href="#">Privacy</a>
            <a className="text-sm text-[#424941] hover:text-[#4a7c59] transition-colors cursor-pointer" href="#">Terms</a>
            <a className="text-sm text-[#424941] hover:text-[#4a7c59] transition-colors cursor-pointer" href="#">Security</a>
            <a className="text-sm text-[#424941] hover:text-[#4a7c59] transition-colors cursor-pointer" href="#">Support</a>
          </nav>

          <p className="text-sm text-[#424941]/80 text-center">
            © 2026 Chatty. Designed for serenity.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
