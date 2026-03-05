import { useState } from "react";
import { useAuth } from "@/services/authContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("judge");
  const [court, setCourt] = useState("High Court Delhi");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name, role, court);
      }
      toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
      navigate("/");
    } catch (err: any) {
      const code = err?.code || "";
      let msg = "Authentication failed";
      if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        msg = "Invalid email or password. If you don't have an account, click Register below.";
      } else if (code === "auth/weak-password") {
        msg = "Password must be at least 6 characters.";
      } else if (code === "auth/email-already-in-use") {
        msg = "This email is already registered. Try signing in instead.";
      } else if (code === "auth/invalid-email") {
        msg = "Please enter a valid email address.";
      } else if (err.message) {
        msg = err.message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16" style={{ background: "var(--gradient-primary)" }}>
        <Scale className="h-12 w-12 text-primary-foreground mb-6" />
        <h1 className="text-4xl font-display font-bold text-primary-foreground mb-4">Juris AI</h1>
        <p className="text-lg text-primary-foreground/80 max-w-md">
          AI-powered judicial case intelligence. Reduce backlog, detect delays, and prioritize cases with predictive analytics.
        </p>
        <div className="mt-12 space-y-4 text-primary-foreground/70 text-sm">
          <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50" /> Adjournment Risk Prediction</div>
          <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50" /> Case Priority Ranking</div>
          <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50" /> Backlog Analytics</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold gradient-text">Juris AI</span>
          </div>

          <h2 className="text-2xl font-display font-bold mb-1">{isLogin ? "Welcome back" : "Create account"}</h2>
          <p className="text-muted-foreground text-sm mb-8">{isLogin ? "Sign in to continue" : "Register for Juris AI"}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Justice A. Sharma" required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Role</Label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="judge">Judge</option>
                      <option value="clerk">Clerk</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <Label>Court</Label>
                    <select value={court} onChange={(e) => setCourt(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>High Court Delhi</option>
                      <option>High Court Mumbai</option>
                      <option>Supreme Court</option>
                      <option>District Court Bangalore</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="judge@courts.gov.in" required /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} /><p className="text-[10px] text-muted-foreground mt-1">Minimum 6 characters</p></div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
              {isLogin ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
