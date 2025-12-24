import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdLanguage, MdMailOutline, MdLock } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Login = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate("/profile", { replace: true });
  }, [user, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return setError("Inserisci una email valida");
    setError("");
    signIn(email);
    navigate("/profile");
  };

  // Matrix canvas effect
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const letters = "0123456789ABCDEF@#$%&*+-<>/\\|".split("");
    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(0).map(() => Math.random() * height);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // brand colors (blue, teal) in rgba with subtle alpha
    const colors = ["rgba(11,116,255,0.16)", "rgba(3,166,146,0.16)"];
    let raf = 0;
    const draw = () => {
      if (!ctx) return;
      // faint background wash to slowly fade previous frames
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // choose a brand color with slight variation
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(text, x, y);
        drops[i] = drops[i] > height / fontSize ? Math.random() * 0.6 : drops[i] + Math.random() * 0.5;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#eaf6ff] via-[#f8fdff] to-[#eef7ff] text-slate-900 flex items-center">
      <canvas ref={canvasRef} className="absolute inset-y-0 right-0 w-1/2 h-full pointer-events-none z-0" />
      <div className="w-1/2 hidden lg:flex items-center justify-center px-20 py-24 relative z-10">
        <div className="max-w-lg">
          <div className="text-blue-700 font-semibold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center font-bold text-white">BW</div>
            Bullwaves
          </div>
          <h1 className="text-4xl font-bold mb-4 text-slate-900">Achieve more with Bullwaves</h1>
          <p className="text-slate-700 leading-relaxed">Access your personalised trading dashboard, monitor positions and manage funds — all from one place. Sign in to continue.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-md bg-white border border-slate-100 rounded-2xl p-8 shadow-lg relative z-10">
          <div className="absolute inset-0 z-0 opacity-30 mix-blend-screen">
            <div className="w-full h-full bg-gradient-to-b from-transparent to-white" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-slate-600 font-medium">CLIENT PORTAL</div>
            <div className="flex items-center gap-2">
              <button className="text-slate-500 hover:text-slate-700 p-2 rounded-md"><MdLanguage /></button>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">v</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-1 text-slate-900">Welcome back!</h2>
          <p className="text-sm text-slate-500 mb-6">Sign in to access your account.</p>

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="text-xs text-slate-600">Email</label>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
              <MdMailOutline className="w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@bullwaves.com"
                className="bg-transparent outline-none w-full placeholder:text-slate-400 text-slate-700"
                required
              />
            </div>

            <label className="text-xs text-slate-600">Password</label>
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
              <MdLock className="w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent outline-none w-full placeholder:text-slate-400 text-slate-700"
                required
              />
              <button type="button" className="text-slate-500 text-xs">Forgot?</button>
            </div>

            {error && <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-semibold shadow-md hover:from-emerald-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-200">Sign In</button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">Connect</div>
          <div className="flex items-center justify-center gap-3 mt-3">
            <button className="p-2 bg-slate-100 text-slate-600 rounded-full"><FaFacebookF /></button>
            <button className="p-2 bg-slate-100 text-slate-600 rounded-full"><FaTwitter /></button>
            <button className="p-2 bg-slate-100 text-slate-600 rounded-full"><FaLinkedinIn /></button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">Don't have an account? <a className="text-emerald-600">Create account</a></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
