import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sparkles, Mail, Lock, ArrowRight, Check, ShieldCheck, Zap, Star } from "lucide-react";
import { useAuth, type Role } from "../context/AuthContext";
import { Badge, Card, Button } from "../components/ui";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("adaeze@eventconnect.app");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState<Role>("client");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role);
    if (role === "vendor") navigate("/vendor");
    else if (role === "planner") navigate("/dashboard");
    else if (role === "admin") navigate("/admin");
    else navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="grid min-h-screen md:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-cream-2 md:flex md:flex-col md:justify-between md:p-12">
          {/* Aurora ambience */}
          <div className="pointer-events-none absolute inset-0">
            <div className="orb h-[420px] w-[420px] -top-20 -left-20" style={{ background: "var(--aurora-1)", opacity: 0.4 }} />
            <div className="orb h-[360px] w-[360px] -bottom-10 -right-10" style={{ background: "var(--aurora-2)", opacity: 0.28 }} />
            <div className="absolute inset-0 grid-pattern opacity-25" />
          </div>

          <Link to="/" className="relative flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl aurora-bg">
              <Sparkles className="h-5 w-5 text-[#0a0a12]" />
            </div>
            <span className="font-display text-2xl">EventConnect<span className="text-coral">.</span>AI</span>
          </Link>

          <div className="relative">
            <Badge variant="primary" className="mb-4">Welcome</Badge>
            <h1 className="font-display text-5xl leading-[1.02] tracking-tight text-slate-900 dark:text-slate-100">
              The event OS,
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">built for pros.</span>
            </h1>
            <p className="mt-4 max-w-md text-ink-2">
              Plan with AI, book verified vendors, pay in installments, track in escrow.
            </p>
            <div className="mt-10 space-y-3">
              {[
                { icon: <Sparkles className="h-4 w-4" />, text: "AI Planner generates your blueprint in 30s" },
                { icon: <ShieldCheck className="h-4 w-4" />, text: "2,400+ vendors across 4 tiers of verification" },
                { icon: <Zap className="h-4 w-4" />, text: "Escrow with 30/30/40 installment schedule" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {f.icon}
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-sm font-bold">
                AO
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Adaeze & Tunde's wedding</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">47 min · 14 vendors booked</div>
              </div>
              <div className="ml-auto flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber text-amber" />
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col justify-center px-6 py-12 md:px-16">
          <Link to="/" className="mb-10 flex items-center gap-2 md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl aurora-bg">
              <Sparkles className="h-4 w-4 text-[#0a0a12]" />
            </div>
            <span className="font-display text-xl">EventConnect<span className="text-coral">.</span>AI</span>
          </Link>

          <div>
            <Badge variant="coral">Welcome back</Badge>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Sign in to continue</h2>
            <p className="mt-2 text-ink/60">Pick your role to explore the platform.</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">Email</label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">Password</label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-ink"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">Continue as</label>
              <div className="mt-1.5 grid grid-cols-2 gap-2 md:grid-cols-4">
                {([
                  { k: "client", label: "Client", emoji: "🎉" },
                  { k: "vendor", label: "Vendor", emoji: "🏪" },
                  { k: "planner", label: "Planner", emoji: "🎩" },
                  { k: "admin", label: "Admin", emoji: "🛡️" },
                ] as { k: Role; label: string; emoji: string }[]).map((r) => (
                  <button
                    key={r.k}
                    type="button"
                    onClick={() => setRole(r.k)}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-semibold transition ${
                      role === r.k ? "border-ink bg-ink text-cream" : "border-ink/10 hover:border-ink/30"
                    }`}
                  >
                    <span className="text-xl">{r.emoji}</span>
                    {r.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-ink/50">
                Demo mode — pick a role to explore that side of the platform.
              </p>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-3 text-xs text-ink/50">
              <div className="h-px flex-1 bg-ink/10" />
              or
              <div className="h-px flex-1 bg-ink/10" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white py-2.5 text-xs font-semibold hover:border-ink/30">
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white py-2.5 text-xs font-semibold hover:border-ink/30">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                Apple
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <Link to="/forgot-password" className="text-xs font-semibold text-coral hover:underline">
              Forgot your password?
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-ink/50">
            <Link to="/signup" className="hover:text-ink">Don't have an account? Sign up</Link>
            <Link to="/" className="hover:text-ink">← Back to site</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>("client");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const finish = () => {
    login(role);
    navigate(role === "vendor" ? "/vendor" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-xl px-6 py-12">
        <Link to="/" className="mb-10 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink">
            <Sparkles className="h-4 w-4 text-coral" />
          </div>
          <span className="font-display text-xl">EventConnect</span>
        </Link>

        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full ${step >= s ? "bg-coral" : "bg-ink/10"}`} />
              <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                Step {s}
              </div>
            </div>
          ))}
        </div>

        <Card className="p-8">
          {step === 1 && (
            <>
              <Badge variant="coral">Step 1 of 3</Badge>
              <h2 className="mt-3 font-display text-3xl">How will you use EventConnect?</h2>
              <div className="mt-6 space-y-2.5">
                {([
                  { k: "client", emoji: "🎉", title: "I'm planning an event", desc: "Wedding, birthday, corporate — I need vendors." },
                  { k: "vendor", emoji: "🏪", title: "I offer services", desc: "I'm a photographer, caterer, venue, DJ, etc." },
                  { k: "planner", emoji: "🎩", title: "I'm an event planner", desc: "I coordinate multiple clients and vendors." },
                ] as { k: Role; emoji: string; title: string; desc: string }[]).map((r) => (
                  <button
                    key={r.k}
                    onClick={() => setRole(r.k)}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      role === r.k ? "border-ink bg-ink text-cream" : "border-ink/10 hover:border-ink/30"
                    }`}
                  >
                    <span className="text-3xl">{r.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold">{r.title}</div>
                      <div className={`text-xs ${role === r.k ? "text-cream/70" : "text-ink/50"}`}>{r.desc}</div>
                    </div>
                    {role === r.k && <Check className="h-5 w-5" />}
                  </button>
                ))}
              </div>
              <Button variant="primary" className="mt-6 w-full" onClick={() => setStep(2)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Badge variant="coral">Step 2 of 3</Badge>
              <h2 className="mt-3 font-display text-3xl">Tell us about yourself</h2>
              <div className="mt-6 space-y-4">
                <Field label={role === "vendor" ? "Business name" : "Full name"} value={name} onChange={setName} placeholder={role === "vendor" ? "Glow by Ronke" : "Adaeze Okonkwo"} />
                <Field label="Email" value={email} onChange={setEmail} placeholder="you@email.com" type="email" />
                <Field label="Password" value="" onChange={() => {}} placeholder="Min 8 characters" type="password" />
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" className="flex-1" onClick={() => setStep(3)}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Badge variant="sage">Step 3 of 3</Badge>
              <h2 className="mt-3 font-display text-3xl">Verify your identity</h2>
              <p className="mt-2 text-sm text-ink/60">Required for payments and trust scoring.</p>
              <div className="mt-6 space-y-3">
                {[
                  { label: "Phone number", status: "Verified", done: true },
                  { label: "Email address", status: "Verified", done: true },
                  { label: "Government ID", status: "Upload", done: false },
                  { label: "Bank account", status: "Link", done: false },
                ].map((v) => (
                  <div key={v.label} className="flex items-center justify-between rounded-xl border border-ink/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${v.done ? "bg-sage/15 text-sage" : "bg-ink/5 text-ink/50"}`}>
                        {v.done ? <Check className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{v.label}</div>
                        <div className="text-xs text-ink/50">{v.status}</div>
                      </div>
                    </div>
                    <button className="text-xs font-semibold text-coral hover:underline">
                      {v.done ? "Done" : "Start"}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button variant="primary" className="flex-1" onClick={finish}>
                  Create account <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </Card>

        <div className="mt-6 text-center text-xs text-ink/50">
          Already have an account? <Link to="/login" className="font-semibold text-ink hover:text-coral">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-3.5 py-3 text-sm outline-none focus:border-ink"
      />
    </div>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink">
            <Sparkles className="h-4 w-4 text-coral" />
          </div>
          <span className="font-display text-xl">EventConnect</span>
        </Link>

        <Card className="p-8">
          {!sent ? (
            <>
              <Badge variant="coral">Account recovery</Badge>
              <h2 className="mt-3 font-display text-3xl">Reset your password</h2>
              <p className="mt-2 text-sm text-ink/60">
                Enter the email linked to your account and we'll send you a secure reset link.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSent(true);
                }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink/50">Email</label>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full rounded-xl border border-ink/10 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-ink"
                    />
                  </div>
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Send reset link <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage/15 text-sage">
                <Check className="h-7 w-7" />
              </div>
              <h2 className="mt-4 font-display text-3xl">Check your inbox</h2>
              <p className="mt-2 text-sm text-ink/60">
                We've sent a password reset link to <span className="font-semibold text-ink">{email}</span>. The link expires in 30 minutes.
              </p>
              <Link to="/login">
                <Button variant="outline" className="mt-6 w-full">Back to sign in</Button>
              </Link>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-ink/50">
            Remembered it? <Link to="/login" className="font-semibold text-ink hover:text-coral">Sign in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
