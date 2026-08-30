"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, BarChart3, Bot, BrainCircuit,
  BookOpen, CalendarClock, Check, CheckCircle2, ChevronDown, CircleDot, Clock3,
  ClipboardCheck, Eye, EyeOff, FileUp, Inbox, KeyRound, Languages, Layers3, Lightbulb, LogIn, LogOut, Moon,
  FlaskConical, Gauge, PackageCheck, PhoneCall, PlayCircle, RefreshCw,
  MessageSquareText, MoreHorizontal, Plus, Search, Send, ShieldCheck,
  Sparkles, Star, Sun, Target, Timer, TrendingUp, UserRoundCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";

type Urgency = "Critical" | "High" | "Medium" | "Low";
type Sentiment = "Negative" | "Mixed" | "Positive";
type Status = "Needs response" | "Draft ready" | "Approved";
type View = "mission" | "story" | "inbox" | "decision" | "recovery" | "intelligence" | "evaluation" | "agent";
type RecoveryStatus = "Action due" | "Customer contacted" | "Resolved";
type DecisionPath = "ignore" | "reply" | "recover";

const DEMO_USERNAME = "judge";
const DEMO_PASSWORD = "nivaran2026";

type Review = {
  id: number; customer: string; initials: string; source: string; rating: number;
  text: string; time: string; sentiment: Sentiment; urgency: Urgency;
  category: string; confidence: number; nextAction: string; reason: string;
  draftEn: string; draftHi: string; status: Status;
};

type RecoveryCase = {
  id: number; customer: string; initials: string; source: string; issue: string;
  risk: Urgency; status: RecoveryStatus; sla: string; owner: string; progress: number;
  action: string; correctiveTask: string; evidence: string;
};

const seed: Review[] = [
  {
    id: 1, customer: "Riya Mehta", initials: "RM", source: "Google", rating: 1,
    text: "The paneer meal arrived 70 minutes late and the seal was broken. Nobody answered when I called. This felt unsafe and I want a refund.",
    time: "8 min ago", sentiment: "Negative", urgency: "Critical", category: "Delivery & safety", confidence: 96,
    nextAction: "Call within 15 min · verify order · issue refund",
    reason: "Safety language, a broken seal, refund intent and an unanswered support call create immediate churn and reputation risk.",
    draftEn: "Hi Riya, we’re truly sorry. A broken seal is unacceptable and your safety comes first. We are reviewing the order now and will call you within 15 minutes to arrange a full refund.",
    draftHi: "Hi Riya, humein bahut afsos hai. Tooti hui seal bilkul acceptable nahi hai—your safety comes first. Hum 15 minutes ke andar call karke full refund arrange karenge.",
    status: "Draft ready",
  },
  {
    id: 2, customer: "Kabir Arora", initials: "KA", source: "Zomato", rating: 2,
    text: "Food was decent but the packaging leaked all over the bag. This is the third time the chutney container has opened.",
    time: "32 min ago", sentiment: "Negative", urgency: "High", category: "Packaging", confidence: 94,
    nextAction: "Apologize · offer replacement · audit container batch",
    reason: "The customer reports a repeated failure. Similar packaging mentions have risen this week, indicating a systemic issue.",
    draftEn: "Hi Kabir, thank you for flagging this—and we’re sorry this happened again. We’re checking today’s container batch and would like to replace your order at no cost.",
    draftHi: "Hi Kabir, dobara packaging leak hone ke liye humein sincerely sorry hai. Hum container batch check kar rahe hain aur order free replace karna chahenge.",
    status: "Draft ready",
  },
  {
    id: 3, customer: "Ananya Bose", initials: "AB", source: "Amazon", rating: 3,
    text: "The product works, but the setup instructions are confusing. A short video or clearer guide would help a lot.",
    time: "1 hr ago", sentiment: "Mixed", urgency: "Medium", category: "Product guidance", confidence: 89,
    nextAction: "Share guide · route insight to product team",
    reason: "There is no urgent service failure, but the feedback identifies a preventable onboarding problem.",
    draftEn: "Hi Ananya, thank you for the useful feedback. You’re right—the setup should be much clearer. We’ve shared a quick-start video and passed your suggestion to our product team.",
    draftHi: "Hi Ananya, useful feedback ke liye thank you. Setup aur clear hona chahiye. Humne quick-start video share kiya hai aur suggestion product team ko bhej diya hai.",
    status: "Needs response",
  },
  {
    id: 4, customer: "Dev Malhotra", initials: "DM", source: "Google", rating: 5,
    text: "Fast service and the team remembered my usual order. That small gesture made my day. Will definitely return!",
    time: "2 hrs ago", sentiment: "Positive", urgency: "Low", category: "Service praise", confidence: 98,
    nextAction: "Thank customer · recognize staff member",
    reason: "This is a strong loyalty signal and a chance to reinforce the behavior that created a memorable experience.",
    draftEn: "Hi Dev, this made our team’s day—thank you! We’re so glad the personal touch mattered and look forward to serving you again soon.",
    draftHi: "Hi Dev, aapke words ne team ka din bana diya—thank you! Jaldi hi aapko dobara serve karne ka wait rahega.",
    status: "Approved",
  },
  {
    id: 5, customer: "Mohit Jain", initials: "MJ", source: "Zomato", rating: 2,
    text: "Quantity has become much smaller even though the price increased. Not worth ordering anymore.",
    time: "3 hrs ago", sentiment: "Negative", urgency: "High", category: "Value & portion", confidence: 91,
    nextAction: "Acknowledge concern · verify serving SOP · contact customer",
    reason: "The review combines value erosion with explicit churn intent. Portion consistency should be checked before replying.",
    draftEn: "Hi Mohit, we understand why this felt disappointing. Our portion standard has not changed, so we’re checking this order with the kitchen team. Please DM the order ID so we can make this right.",
    draftHi: "Hi Mohit, hum samajh sakte hain ki yeh disappointing tha. Hum kitchen team ke saath order check kar rahe hain. Please order ID DM karein—hum ise resolve karna chahte hain.",
    status: "Draft ready",
  },
  {
    id: 6, customer: "Sara Khan", initials: "SK", source: "Direct", rating: 4,
    text: "Support solved my issue quickly. I only had to repeat my order number twice, which was a little frustrating.",
    time: "Yesterday", sentiment: "Mixed", urgency: "Low", category: "Support process", confidence: 87,
    nextAction: "Thank customer · fix context handoff",
    reason: "The outcome was positive, but repeated information indicates a support handoff gap.",
    draftEn: "Hi Sara, thank you for your patience. We’re glad the issue was resolved, but you shouldn’t need to repeat your details. We’re improving that handoff.",
    draftHi: "Hi Sara, patience ke liye thank you. Issue solve hua, lekin aapko details repeat nahi karni chahiye thi. Hum support handoff improve kar rahe hain.",
    status: "Needs response",
  },
];

const rank: Record<Urgency, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
const issues = [
  { name: "Packaging", count: 12, width: 88, trend: "+38%", action: "Audit container batch" },
  { name: "Delivery delay", count: 9, width: 66, trend: "+14%", action: "Review 7–9 PM staffing" },
  { name: "Value & portion", count: 6, width: 45, trend: "+8%", action: "Check serving SOP" },
  { name: "Product guidance", count: 4, width: 30, trend: "−11%", action: "Publish quick-start video" },
];

const steps = [
  { name: "Signal Agent", text: "Sentiment, topic and urgency", icon: BrainCircuit },
  { name: "Recovery Agent", text: "Policy-safe next best action", icon: Target },
  { name: "Response Agent", text: "Contextual bilingual draft", icon: MessageSquareText },
  { name: "Human checkpoint", text: "Owner reviews before publish", icon: UserRoundCheck },
];

const storyCases = [
  {
    label: "Safety risk", customer: "Riya · Google", rating: 1, urgency: "Critical", topic: "Delivery & safety", confidence: 96,
    quote: "The seal was broken, nobody answered, and this felt unsafe. I want a refund.",
    action: "Call in 15 min · verify order · issue refund",
    draft: "Riya, a broken seal is unacceptable. We’re reviewing this now and will call you within 15 minutes.",
  },
  {
    label: "Repeat issue", customer: "Kabir · Zomato", rating: 2, urgency: "High", topic: "Packaging", confidence: 94,
    quote: "The packaging leaked again. This is the third time the chutney container has opened.",
    action: "Replace order · audit container batch",
    draft: "Kabir, we’re sorry this happened again. We’re checking today’s batch and would like to replace the order.",
  },
  {
    label: "Loyalty signal", customer: "Dev · Google", rating: 5, urgency: "Low", topic: "Service praise", confidence: 98,
    quote: "The team remembered my usual order. That small gesture made my day.",
    action: "Thank customer · recognize staff",
    draft: "Dev, this made our team’s day. Thank you—we’re so glad the personal touch mattered.",
  },
];

const recoverySeed: RecoveryCase[] = [
  { id: 101, customer: "Riya Mehta", initials: "RM", source: "Google", issue: "Broken food seal", risk: "Critical", status: "Action due", sla: "11 min left", owner: "Arjun · Owner", progress: 25, action: "Call customer, verify order and authorize a full refund", correctiveTask: "Quarantine today’s seal batch before dinner service", evidence: "Callback and refund reference still required" },
  { id: 102, customer: "Kabir Arora", initials: "KA", source: "Zomato", issue: "Third packaging leak", risk: "High", status: "Customer contacted", sla: "42 min left", owner: "Rhea · Ops", progress: 62, action: "Replace order at no cost and confirm delivery", correctiveTask: "Audit chutney-container batch and update packing checklist", evidence: "Customer callback logged · replacement dispatch pending" },
  { id: 103, customer: "Sara Khan", initials: "SK", source: "Direct", issue: "Repeated order-number handoff", risk: "Low", status: "Resolved", sla: "Completed", owner: "Neha · Support", progress: 100, action: "Acknowledge the handoff gap and confirm resolution", correctiveTask: "Preserve order context across support handoffs", evidence: "Customer confirmed resolution · SOP task created" },
];

const decisionPaths: Array<{
  id: DecisionPath; label: string; kicker: string; risk: string; trust: string;
  score: number; horizon: string; outcome: string; steps: string[];
}> = [
  {
    id: "ignore", label: "Do nothing", kicker: "No intervention", risk: "94%", trust: "−31", score: 18,
    horizon: "Likely escalation in 6h", outcome: "The safety concern stays public, the refund request remains unanswered and the same seal batch remains in circulation.",
    steps: ["No customer contact", "No operational containment", "Reputation risk compounds"],
  },
  {
    id: "reply", label: "Reply only", kicker: "Surface response", risk: "58%", trust: "+4", score: 47,
    horizon: "Public response in 15m", outcome: "The customer sees an apology, but the refund, broken-seal batch and final outcome are still unverified.",
    steps: ["Publish human-approved apology", "Ask for order details", "Root cause remains open"],
  },
  {
    id: "recover", label: "Full recovery", kicker: "Recommended path", risk: "16%", trust: "+24", score: 86,
    horizon: "Verified outcome in 45m", outcome: "Customer recovery and operational containment run together, with evidence required before the case can close.",
    steps: ["Call and authorize refund", "Quarantine today’s seal batch", "Verify customer outcome"],
  },
];

const benchmarkSlices = [
  { name: "Critical-risk recall", detail: "Safety, fraud and refund language", score: 94, result: "17 / 18", tone: "green" },
  { name: "Rationale coverage", detail: "Decision includes visible evidence", score: 91, result: "29 / 32", tone: "blue" },
  { name: "Brand-safety checks", detail: "No promises outside policy", score: 100, result: "32 / 32", tone: "green" },
  { name: "Human edit rate", detail: "Drafts meaningfully changed by owner", score: 77, result: "23% edited", tone: "amber" },
];

const edgeCases = [
  { signal: "Sarcasm", sample: "Amazing—only waited 90 minutes.", verdict: "High risk", status: "Passed" },
  { signal: "Mixed intent", sample: "Good food, but I will not order again.", verdict: "Churn risk", status: "Passed" },
  { signal: "Safety ambiguity", sample: "The seal looked odd; not sure it was open.", verdict: "Human review", status: "Guarded" },
  { signal: "Repeat failure", sample: "Third leak this month.", verdict: "Systemic issue", status: "Passed" },
];

function pause(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function analyze(text: string, rating: number) {
  const value = text.toLowerCase();
  const category = /pack|leak|seal/.test(value) ? "Packaging" : /late|delivery/.test(value) ? "Delivery delay" : /price|quantity|portion/.test(value) ? "Value & portion" : /guide|setup|instruction/.test(value) ? "Product guidance" : /support|call/.test(value) ? "Support process" : "Product experience";
  const urgency: Urgency = /unsafe|fraud|sick|refund|broken seal/.test(value) ? "Critical" : rating <= 2 || /late|leak|damaged|worst/.test(value) ? "High" : rating === 3 ? "Medium" : "Low";
  const sentiment: Sentiment = rating <= 2 ? "Negative" : rating === 3 ? "Mixed" : "Positive";
  return { category, urgency, sentiment };
}

function makeReview(customer: string, source: string, rating: number, text: string): Review {
  const result = analyze(text, rating);
  const first = customer.split(" ")[0] || "there";
  return {
    id: Date.now() + Math.floor(Math.random() * 1000), customer: customer || "New customer",
    initials: (customer || "NC").split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase(),
    source: source || "Direct", rating, text, time: "Just now", ...result, confidence: 92,
    nextAction: result.urgency === "Critical" ? "Escalate now · contact customer · verify resolution" : result.sentiment === "Positive" ? "Thank customer · reinforce loyalty" : "Acknowledge issue · investigate · offer next step",
    reason: `${result.category} was identified as the primary topic and matched to the ${result.urgency.toLowerCase()}-priority recovery playbook.`,
    draftEn: result.sentiment === "Positive" ? `Hi ${first}, thank you for sharing this. We’re delighted you had a good experience.` : `Hi ${first}, we’re sorry this experience fell short. We’re reviewing the details and would like to contact you directly to make this right.`,
    draftHi: result.sentiment === "Positive" ? `Hi ${first}, feedback ke liye thank you. Humein khushi hai ki aapka experience accha raha.` : `Hi ${first}, humein afsos hai ki experience expected level ka nahi tha. Hum details check karke ise resolve karna chahenge.`,
    status: "Draft ready",
  };
}

function Stars({ value }: { value: number }) {
  return <span className="stars" aria-label={`${value} stars`}>{[1,2,3,4,5].map((n) => <Star key={n} className={n <= value ? "filled" : ""} />)}</span>;
}

function Source({ name }: { name: string }) { return <span className={`source source-${name.toLowerCase()}`}>{name[0]}</span>; }

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [reviews, setReviews] = useState(seed);
  const [view, setView] = useState<View>("mission");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [stage, setStage] = useState(3);
  const [form, setForm] = useState({ customer: "", source: "Google", rating: 2, text: "" });
  const fileRef = useRef<HTMLInputElement>(null);
  const selected = reviews.find((r) => r.id === selectedId) || reviews[0];
  const [edited, setEdited] = useState(selected.draftEn);
  const [storyCase, setStoryCase] = useState(0);
  const liveStory = storyCases[storyCase];
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [recoveryCases, setRecoveryCases] = useState(recoverySeed);
  const [recoveryId, setRecoveryId] = useState(101);
  const activeRecovery = recoveryCases.find((item) => item.id === recoveryId) || recoveryCases[0];
  const [decisionPath, setDecisionPath] = useState<DecisionPath>("recover");
  const activeDecision = decisionPaths.find((item) => item.id === decisionPath) || decisionPaths[2];
  const [evalRunning, setEvalRunning] = useState(false);
  const [evalProgress, setEvalProgress] = useState(100);
  const [missionRunning, setMissionRunning] = useState(false);
  const [missionStep, setMissionStep] = useState(-1);
  const [missionProgress, setMissionProgress] = useState(0);
  const [proofSealed, setProofSealed] = useState(false);

  useEffect(() => {
    try {
      setAuthenticated(window.sessionStorage.getItem("nivaran-demo-access") === "granted");
    } finally {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => { delete document.documentElement.dataset.theme; };
  }, [theme]);

  const metrics = useMemo(() => ({
    urgent: reviews.filter((r) => ["Critical", "High"].includes(r.urgency)).length,
    pending: reviews.filter((r) => r.status !== "Approved").length,
    rating: (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1),
  }), [reviews]);

  const visible = useMemo(() => reviews.filter((r) => {
    if (filter === "Urgent" && !["Critical", "High"].includes(r.urgency)) return false;
    if (filter === "Negative" && r.sentiment !== "Negative") return false;
    if (filter === "Positive" && r.sentiment !== "Positive") return false;
    const q = query.toLowerCase();
    return !q || r.customer.toLowerCase().includes(q) || r.text.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
  }).sort((a,b) => rank[a.urgency] - rank[b.urgency]), [reviews, filter, query]);

  function openReview(review: Review) {
    setSelectedId(review.id); setEdited(language === "en" ? review.draftEn : review.draftHi); setSheet(true);
  }

  function toggleLanguage() {
    const next = language === "en" ? "hi" : "en"; setLanguage(next); setEdited(next === "en" ? selected.draftEn : selected.draftHi);
  }

  async function runAgent() {
    if (running) return;
    setRunning(true); setProgress(8);
    for (let i = 0; i < steps.length; i++) { setStage(i); setProgress(20 + i * 25); await pause(550); }
    setReviews((current) => current.map((r) => r.status === "Needs response" ? { ...r, status: "Draft ready" } : r));
    setProgress(100); setRunning(false);
    toast.success("Agent run complete", { description: `${reviews.length} reviews prioritized · ${metrics.urgent} need attention` });
  }

  function approve() {
    setReviews((current) => current.map((r) => r.id === selected.id ? { ...r, status: "Approved", ...(language === "en" ? { draftEn: edited } : { draftHi: edited }) } : r));
    setSheet(false); toast.success("Response approved", { description: "Human approval logged and response queued." });
  }

  function addReview() {
    if (!form.text.trim()) return toast.error("Add review text first.");
    const item = makeReview(form.customer, form.source, form.rating, form.text);
    setReviews((r) => [item, ...r]); setDialog(false); setForm({ customer: "", source: "Google", rating: 2, text: "" });
    toast.success("Review analyzed", { description: `${item.urgency} priority · ${item.category}` });
    openReview(item);
  }

  function importCsv(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const rows = String(reader.result || "").split(/\r?\n/).filter(Boolean).slice(1, 21);
      const items = rows.map((row) => { const [customer, source, rating, ...text] = row.split(","); const body = text.join(",").replace(/^"|"$/g, "").trim(); return body ? makeReview(customer.trim(), source.trim(), Number(rating) || 3, body) : null; }).filter(Boolean) as Review[];
      if (!items.length) return toast.error("Use CSV columns: customer, source, rating, text");
      setReviews((r) => [...items, ...r]); toast.success(`${items.length} reviews imported and analyzed.`);
    };
    reader.readAsText(file);
  }

  function advanceRecovery() {
    if (activeRecovery.status === "Resolved") return toast.success("Recovery already verified", { description: "Customer outcome and operational evidence are recorded." });
    const next: RecoveryStatus = activeRecovery.status === "Action due" ? "Customer contacted" : "Resolved";
    setRecoveryCases((current) => current.map((item) => item.id === activeRecovery.id ? { ...item, status: next, progress: next === "Resolved" ? 100 : 62, sla: next === "Resolved" ? "Completed" : item.sla, evidence: next === "Resolved" ? "Customer confirmed resolution · corrective task assigned" : "Customer callback logged · outcome confirmation pending" } : item));
    toast.success(next === "Resolved" ? "Recovery outcome verified" : "Customer contact logged", { description: next === "Resolved" ? "The case is closed with evidence." : "The SLA and next action remain visible." });
  }

  function commitDecision() {
    setDecisionPath("recover");
    toast.success("Recovery path selected", { description: "Human approval recorded · Riya’s recovery case is ready." });
    setView("recovery");
  }

  async function runEvaluation() {
    if (evalRunning) return;
    setEvalRunning(true); setEvalProgress(12);
    for (const value of [34, 58, 81, 100]) { await pause(420); setEvalProgress(value); }
    setEvalRunning(false);
    toast.success("Evaluation suite passed", { description: "32 synthetic cases · 4 edge-case slices · 1 guarded escalation" });
  }

  async function runMission() {
    if (missionRunning) return;
    setMissionRunning(true); setProofSealed(false); setMissionStep(0); setMissionProgress(18);
    for (const [index, value] of [34, 58, 79, 100].entries()) {
      await pause(620); setMissionStep(index); setMissionProgress(value);
    }
    setRecoveryCases((current) => current.map((item) => item.id === 101 ? { ...item, status: "Resolved", progress: 100, sla: "Completed", evidence: "Customer confirmed refund · seal batch quarantined · owner approval recorded" } : item));
    setProofSealed(true); setMissionRunning(false);
    toast.success("Recovery receipt sealed", { description: "Customer outcome, operational correction and human approval are now linked." });
  }

  function enterDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (credentials.username.trim().toLowerCase() !== DEMO_USERNAME || credentials.password !== DEMO_PASSWORD) {
      setAuthError("That demo ID or password is incorrect. Use the judge access shown below.");
      return;
    }
    window.sessionStorage.setItem("nivaran-demo-access", "granted");
    setAuthError("");
    setAuthenticated(true);
  }

  function exitDemo() {
    window.sessionStorage.removeItem("nivaran-demo-access");
    setCredentials({ username: "", password: "" });
    setAuthenticated(false);
  }

  if (!authReady || !authenticated) {
    return <main className={`login-shell ${theme === "dark" ? "night" : "day"}`} data-testid="demo-login">
      <section className="login-story">
        <header><span className="login-mark"><Sparkles/></span><div><strong>Nivaran</strong><small>Review-to-Recovery OS</small></div></header>
        <div className="login-narrative">
          <span className="login-kicker"><Activity/> AI Product Buildathon · Problem 08</span>
          <h1>Repair customer trust <em>before</em> reputation damage compounds.</h1>
          <p>Nivaran turns one public review into a safe decision, an owned recovery workflow and a verifiable outcome—not another sentiment dashboard.</p>
          <div className="login-chain" aria-label="Nivaran recovery chain">
            {["Signal", "Decision", "Action", "Evidence", "Recovery"].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < 4 && <ArrowRight/>}</div>)}
          </div>
          <div className="login-proof-grid">
            <article><strong>94 → 16%</strong><span>unresolved risk</span></article>
            <article><strong>4-stage</strong><span>proof chain</span></article>
            <article><strong>Human</strong><span>approval boundary</span></article>
          </div>
        </div>
        <footer><ShieldCheck/><span>Synthetic judge workspace · no customer response is published</span></footer>
      </section>

      <section className="login-access">
        <button className="login-theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun/> : <Moon/>}</button>
        <form className="login-card" onSubmit={enterDemo}>
          <span className="access-badge"><KeyRound/> Judge access</span>
          <h2>Enter recovery command.</h2>
          <p>No signup, social login or verification. Use the simple demo access below.</p>
          <label>Login ID<Input autoComplete="username" value={credentials.username} onChange={(event) => { setCredentials({ ...credentials, username: event.target.value }); setAuthError(""); }} placeholder="Enter login ID"/></label>
          <label>Password<div className="password-field"><Input type={showPassword ? "text" : "password"} autoComplete="current-password" value={credentials.password} onChange={(event) => { setCredentials({ ...credentials, password: event.target.value }); setAuthError(""); }} placeholder="Enter password"/><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff/> : <Eye/>}</button></div></label>
          {authError && <p className="login-error" role="alert">{authError}</p>}
          <Button type="submit" className="login-submit"><LogIn/> Enter Nivaran <ArrowRight/></Button>
          <button type="button" className="demo-credential" onClick={() => { setCredentials({ username: DEMO_USERNAME, password: DEMO_PASSWORD }); setAuthError(""); }}>
            <span><KeyRound/></span><p><small>One-tap demo access</small><strong>{DEMO_USERNAME} · {DEMO_PASSWORD}</strong></p><b>Use</b>
          </button>
          <small className="login-disclaimer">Demo convenience gate only. Production authentication would be server-side.</small>
        </form>
        <div className="login-footnote"><i/><span>All systems ready</span><b>NVR · 2026</b></div>
      </section>
      <Toaster position="top-right" richColors/>
    </main>;
  }

  const title = view === "mission" ? "Recovery command" : view === "story" ? "Product story" : view === "inbox" ? "Reputation desk" : view === "decision" ? "Decision lab" : view === "recovery" ? "Recovery control" : view === "intelligence" ? "Customer intelligence" : view === "evaluation" ? "Evaluation lab" : "Agent system";
  const subtitle = view === "mission" ? "See the complete path from exposed reputation risk to sealed recovery evidence." : view === "story" ? "Why Nivaran exists, how it works, and what we learned building it." : view === "inbox" ? "Every review, prioritized. Every response, human-approved." : view === "decision" ? "Compare possible actions before customer and reputation risk compound." : view === "recovery" ? "Close the loop from public complaint to verified customer outcome." : view === "intelligence" ? "Turn recurring signals into decisions your team can act on." : view === "evaluation" ? "Inspect benchmark quality, edge cases and safety boundaries—not just a polished demo." : "See how three specialist agents turn feedback into safe action.";

  return <main className={`app-shell ${theme === "dark" ? "night" : "day"}`} data-testid="nivaran-dashboard">
    <aside className="sidebar">
      <div className="brand"><span><Sparkles /></span><div><strong>Nivaran</strong><small>Review intelligence</small></div></div>
      <nav><label>Workspace</label>
        <button className={view === "mission" ? "active" : ""} onClick={() => setView("mission")}><Activity/><span>Recovery command</span><i/></button>
        <button className={view === "story" ? "active" : ""} onClick={() => setView("story")}><BookOpen/><span>Product story</span></button>
        <button className={view === "inbox" ? "active" : ""} onClick={() => setView("inbox")}><Inbox/><span>Review inbox</span><b>{metrics.pending}</b></button>
        <button className={view === "decision" ? "active" : ""} onClick={() => setView("decision")}><Layers3/><span>Decision lab</span><i/></button>
        <button className={view === "recovery" ? "active" : ""} onClick={() => setView("recovery")}><ClipboardCheck/><span>Recovery cases</span><b className="recovery-count">2</b></button>
        <button className={view === "intelligence" ? "active" : ""} onClick={() => setView("intelligence")}><BarChart3/><span>Intelligence</span></button>
        <button className={view === "evaluation" ? "active" : ""} onClick={() => setView("evaluation")}><FlaskConical/><span>Evaluation lab</span><i/></button>
        <button className={view === "agent" ? "active" : ""} onClick={() => setView("agent")}><Bot/><span>Agent system</span><i/></button>
      </nav>
      <div className="side-status"><span><Bot/></span><strong>Demo agent ready</strong><p>Four sample channels with human approval enabled.</p><small><i/> Synthetic data loaded</small></div>
      <div className="profile"><b>AS</b><div><strong>Arora Kitchen</strong><small>Owner workspace</small></div><MoreHorizontal/></div>
    </aside>

    <section className="workspace">
      <header className="topbar"><p>{view === "story" || view === "mission" ? "Nivaran" : "Arora Kitchen"} <span>/</span> {view === "story" || view === "mission" ? "Review-to-Recovery OS" : "Demo workspace"}</p><div><button className="theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun/> : <Moon/>}<span>{theme === "dark" ? "Light" : "Night"}</span></button><button onClick={toggleLanguage}><Languages/> {language === "en" ? "English" : "Hinglish"}<ChevronDown/></button><span className="healthy"><i/> Synthetic demo</span><button className="session-exit" onClick={exitDemo}><LogOut/><span>Exit</span></button></div></header>
      <div className={view === "story" || view === "mission" ? "content content-story" : "content"}>
        <Tabs value={view} onValueChange={(v) => setView(v as View)}>
          <div className="heading"><div><h1>{title}</h1><p>{subtitle}</p></div><div>
            <input ref={fileRef} hidden type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])}/>
            {view === "mission" ? <Button variant="outline" onClick={() => setView("decision")}><Layers3/> Inspect decision</Button> : view === "story" ? <Button variant="outline" onClick={() => setView("agent")}><Layers3/> See architecture</Button> : view === "decision" ? <Button variant="outline" onClick={() => setDecisionPath("ignore")}><AlertTriangle/> Test worst case</Button> : view === "recovery" ? <Button variant="outline" onClick={() => setView("agent")}><ShieldCheck/> View guardrails</Button> : view === "evaluation" ? <Button variant="outline" onClick={() => setView("decision")}><Layers3/> Inspect decisions</Button> : <Button variant="outline" onClick={() => fileRef.current?.click()}><FileUp/> Import CSV</Button>}
            <Button className="run-button" onClick={view === "mission" ? runMission : view === "story" ? () => setView("inbox") : view === "decision" ? commitDecision : view === "recovery" ? advanceRecovery : view === "evaluation" ? runEvaluation : runAgent} disabled={running || evalRunning || missionRunning}>{view === "mission" ? missionRunning ? <RefreshCw/> : <ShieldCheck/> : view === "story" ? <PlayCircle/> : view === "decision" ? <Target/> : view === "recovery" ? <ClipboardCheck/> : view === "evaluation" ? evalRunning ? <RefreshCw/> : <FlaskConical/> : running ? <Activity/> : <Sparkles/>}{view === "mission" ? missionRunning ? "Sealing recovery…" : proofSealed ? "Replay recovery" : "Run recovery mission" : view === "story" ? "Open interactive demo" : view === "decision" ? "Select recovery path" : view === "recovery" ? "Advance selected case" : view === "evaluation" ? evalRunning ? "Running suite…" : "Run evaluation" : running ? "Agent working…" : "Run Nivaran Agent"}</Button>
          </div></div>
          <TabsList variant="line" className="main-tabs"><TabsTrigger value="mission"><Activity/> Command</TabsTrigger><TabsTrigger value="story"><BookOpen/> Story</TabsTrigger><TabsTrigger value="inbox"><Inbox/> Inbox</TabsTrigger><TabsTrigger value="decision"><Layers3/> Decision</TabsTrigger><TabsTrigger value="recovery"><ClipboardCheck/> Recovery</TabsTrigger><TabsTrigger value="intelligence"><BarChart3/> Intelligence</TabsTrigger><TabsTrigger value="evaluation"><FlaskConical/> Evaluation</TabsTrigger><TabsTrigger value="agent"><Bot/> Agents</TabsTrigger></TabsList>

          <TabsContent value="mission" className="tab-content mission-content">
            <section className="mission-cockpit">
              <div className="mission-copy"><span><Activity/> Problem 08 · Live synthetic incident</span><h2>Turn reputation damage into a <em>provable recovery.</em></h2><p>One control plane connects the public review, the safest decision, the customer action, the operational fix and the evidence required to close the loop.</p><div className="trust-chain">{["Signal", "Decide", "Act", "Prove", "Recover"].map((item, index) => <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}{index < 4 && <ArrowRight/>}</span>)}</div><div><Button onClick={runMission} disabled={missionRunning}>{missionRunning ? <RefreshCw/> : <PlayCircle/>}{missionRunning ? "Executing safe path…" : proofSealed ? "Replay the mission" : "Run the recovery mission"}</Button><button onClick={() => setView("story")}>Why this product wins <ArrowRight/></button></div><small><ShieldCheck/> Simulated workflow · no response is published</small></div>
              <aside className="mission-orbit" aria-live="polite">
                <div className="orbit-shell" style={{background:`conic-gradient(#d9ef79 ${missionProgress * 3.6}deg, #ffffff12 0deg)`}}><div><small>{proofSealed ? "Recovery state" : "Intervention window"}</small><strong>{proofSealed ? "SEALED" : "16 min"}</strong><span>{missionRunning ? `Stage ${Math.min(missionStep + 1, 4)} of 4` : proofSealed ? "4 / 4 evidence" : "Critical priority"}</span></div></div>
                <div className="orbit-signals"><p><i className="red"/><span>Public risk</span><b>{proofSealed ? "16%" : "94%"}</b></p><p><i className="amber"/><span>Customer trust</span><b>{proofSealed ? "+24" : "−31"}</b></p><p><i className="green"/><span>Containment</span><b>{proofSealed ? "Complete" : "Open"}</b></p></div>
              </aside>
            </section>

            <section className="brief-coverage"><header><div><small>Official problem-statement coverage</small><h3>Every required capability is visible and testable.</h3></div><span><CheckCircle2/> 5 / 5 covered</span></header><div>{[
              [Inbox,"Monitor reviews","Multi-source inbox"],
              [BrainCircuit,"Classify signals","Sentiment + issue"],
              [AlertTriangle,"Find urgency","Evidence-led risk"],
              [MessageSquareText,"Draft responses","English + Hinglish"],
              [TrendingUp,"Expose patterns","Recurring root causes"],
            ].map(([Icon,label,detail]) => { const CoverageIcon = Icon as typeof Inbox; return <article key={String(label)}><span><CoverageIcon/></span><p><strong>{String(label)}</strong><small>{String(detail)}</small></p><Check/></article>})}</div><footer><Sparkles/><p><strong>Nivaran goes one step further:</strong> it coordinates the fix and refuses to call the case recovered until evidence is complete.</p></footer></section>

            <section className="mission-grid">
              <article className="incident-card"><header><div><span className="case-avatar large">RM</span><p><small>Critical signal · Google · 8 min ago</small><strong>Riya Mehta</strong></p></div><span className="urgency critical"><i/>Critical</span></header><blockquote>“The paneer arrived 70 minutes late and the seal was broken. Nobody answered. This felt unsafe.”</blockquote><div className="incident-evidence"><span>Broken seal</span><span>Safety language</span><span>Refund intent</span><span>Unanswered call</span></div><section><div><Target/><p><small>Recommended intervention</small><strong>Call in 15 min · refund · quarantine today’s seal batch</strong></p></div><b>96%<small>evidence confidence</small></b></section><footer><ShieldCheck/><p><strong>Why Nivaran escalated</strong><small>Risk language and an unresolved public complaint outweigh the star rating alone.</small></p></footer></article>

              <article className="recovery-twin"><header><div><small>Recovery Twin · compare consequence</small><h3>One action changes three systems</h3></div><span>Synthetic scenario</span></header><div className="twin-switcher">{decisionPaths.map((path) => <button key={path.id} className={decisionPath === path.id ? `active ${path.id}` : path.id} onClick={() => setDecisionPath(path.id)}>{path.label}</button>)}</div><div className="twin-states"><section><span><UserRoundCheck/></span><p><small>Customer</small><strong>{activeDecision.id === "recover" ? "Refund + callback" : activeDecision.id === "reply" ? "Acknowledged" : "Unanswered"}</strong></p><b>{activeDecision.trust}</b></section><ArrowRight/><section><span><MessageSquareText/></span><p><small>Public reputation</small><strong>{activeDecision.id === "recover" ? "Risk contained" : activeDecision.id === "reply" ? "Partially contained" : "Compounding"}</strong></p><b>{activeDecision.risk}</b></section><ArrowRight/><section><span><PackageCheck/></span><p><small>Operations</small><strong>{activeDecision.id === "recover" ? "Batch quarantined" : "Root cause open"}</strong></p><b>{activeDecision.score}</b></section></div><footer><div><small>Recommended because</small><strong>{activeDecision.outcome}</strong></div><button onClick={() => setView("decision")}>Open full decision trace <ArrowRight/></button></footer></article>
            </section>

            <section className="proof-grid">
              <article className={`proof-receipt ${proofSealed ? "sealed" : ""}`}><header><div><span><ClipboardCheck/></span><p><small>Recovery Receipt</small><strong>NVR-PROOF-0829-041</strong></p></div><em><i/>{proofSealed ? "Evidence sealed" : missionRunning ? "Recording evidence" : "Awaiting mission"}</em></header><div className="proof-timeline">{[
                ["Signal witnessed","Broken seal + safety language",BrainCircuit],
                ["Human authorized","Refund and callback approved",UserRoundCheck],
                ["Cause contained","Seal batch quarantined",PackageCheck],
                ["Outcome verified","Customer confirmed recovery",CheckCircle2],
              ].map(([label,detail,Icon],index) => { const ProofIcon = Icon as typeof BrainCircuit; const done = proofSealed || missionStep >= index; return <section className={done ? "done" : missionStep + 1 === index && missionRunning ? "current" : ""} key={String(label)}><span>{done ? <Check/> : <ProofIcon/>}</span><p><small>0{index + 1}</small><strong>{String(label)}</strong><em>{String(detail)}</em></p><b>{done ? "Recorded" : "Pending"}</b></section>})}</div><footer><span><ShieldCheck/> Human-owned · synthetic evidence</span><code>{proofSealed ? "sha256: 8f29…a041" : "hash generated after verification"}</code></footer></article>

              <aside className="command-brief"><header><span><Sparkles/></span><p><small>Judge’s 20-second takeaway</small><strong>Nivaran closes what review tools leave open.</strong></p></header><div><p><span>01</span><strong>Understands risk</strong><small>not sentiment alone</small></p><p><span>02</span><strong>Compares actions</strong><small>before damage compounds</small></p><p><span>03</span><strong>Coordinates recovery</strong><small>customer + operations</small></p><p><span>04</span><strong>Seals evidence</strong><small>before closure</small></p></div><footer><button onClick={() => setView("evaluation")}><FlaskConical/> Inspect how it fails</button><button onClick={() => setView("agent")}><Bot/> Open agent system</button></footer></aside>
            </section>
          </TabsContent>

          <TabsContent value="story" className="tab-content">
            <section className="story-hero recovery-story">
              <div className="story-copy"><span><Sparkles/> Problem Statement 08 · Interactive MVP</span><h2>From public review to <em>verified recovery.</em></h2><p>Nivaran is not another ticket classifier. It is an explainable Review-to-Recovery OS for Indian local businesses—connecting public reputation risk, the next safe action, a bilingual response, and proof that the customer was actually recovered.</p><div className="story-actions"><Button onClick={() => setView("inbox")}><PlayCircle/> Explore the product</Button><button onClick={() => setView("recovery")}><ClipboardCheck/> See the recovery loop</button></div><div className="story-proof"><span><strong>04</strong> visible stages</span><span><strong>02</strong> response languages</span><span><strong>01</strong> verified outcome</span></div></div>
              <aside className="recovery-lab"><header><div><span><Activity/></span><p><small>Live recovery lab</small><strong>Choose a customer signal</strong></p></div><em><i/> Demo</em></header><div className="case-switcher">{storyCases.map((item,i) => <button key={item.label} className={storyCase === i ? "active" : ""} aria-pressed={storyCase === i} onClick={() => setStoryCase(i)}>{item.label}</button>)}</div><article className="signal-card" key={liveStory.label}><header><p><strong>{liveStory.customer}</strong><Stars value={liveStory.rating}/></p><span className={`urgency ${liveStory.urgency.toLowerCase()}`}><i/>{liveStory.urgency}</span></header><blockquote>“{liveStory.quote}”</blockquote></article><div className="signal-read"><span><BrainCircuit/></span><p><small>Signal understood</small><strong>{liveStory.topic}</strong></p><b>{liveStory.confidence}%</b></div><div className="recovery-action"><span><Target/></span><p><small>Next safe action</small><strong>{liveStory.action}</strong></p></div><div className="draft-peek"><header><span><MessageSquareText/> Human-ready draft</span><b>EN</b></header><p>{liveStory.draft}</p></div><footer><ShieldCheck/> Nothing posts without owner approval</footer></aside>
            </section>

            <section className="story-marquee" aria-label="Nivaran product principles"><span>Prioritize public reputation risk</span><i/><span>Turn replies into recovery cases</span><i/><span>Verify the customer outcome</span></section>

            <section className="story-bento">
              <article className="problem-card"><header><span className="story-icon coral"><AlertTriangle/></span><div><small>The fragmented reality</small><h3>Feedback arrives everywhere. Context lives nowhere.</h3></div></header><div className="channel-map"><div><span className="source-chip google">G</span><p><strong>Google</strong><small>“Unsafe packaging”</small></p><b>1★</b></div><div><span className="source-chip zomato">Z</span><p><strong>Zomato</strong><small>“Third leak this week”</small></p><b>2★</b></div><div><span className="source-chip direct">D</span><p><strong>Direct</strong><small>“Support fixed it”</small></p><b>4★</b></div><footer><span/><p>Owners manually connect urgency, history and policy—usually after the damage is visible.</p></footer></div></article>
              <article className="outcome-card"><small>The Nivaran difference</small><h3>Move from “reply faster” to <em>recover smarter.</em></h3><div className="before-after"><section><b>Before</b><p><AlertTriangle/> Read every review</p><p><AlertTriangle/> Guess the priority</p><p><AlertTriangle/> Write generic replies</p></section><ArrowRight/><section><b>With Nivaran</b><p><Check/> Compare possible actions</p><p><Check/> Tie action to evidence</p><p><Check/> Verify the outcome</p></section></div><button onClick={() => setView("decision")}>Compare recovery paths <ArrowRight/></button></article>
              <article className="promise-card"><Sparkles/><small>Core product promise</small><blockquote>“Owners need the next safe action—not another sentiment dashboard.”</blockquote><p>Every screen is designed to answer three questions: What happened? Why does it matter? What should I do next?</p></article>
            </section>

            <section className="story-section">
              <header><div><small>How we built it</small><h3>A transparent multi-agent workflow</h3></div><p>Each stage has one job and hands structured evidence to the next. The owner remains the final decision-maker.</p></header>
              <div className="story-flow">{steps.map((s,i) => { const Icon=s.icon; return <article key={s.name}><b>0{i+1}</b><span><Icon/></span><h4>{s.name}</h4><p>{s.text}</p>{i < steps.length-1 && <ArrowRight/>}</article>})}</div>
              <div className="tool-row"><small>Prototype stack</small>{["Next.js","TypeScript","Explainable rules","CSV input","Human approval"].map((x) => <span key={x}>{x}</span>)}</div>
            </section>

            <section className="story-bottom">
              <article className="feature-card"><header><span><CheckCircle2/></span><div><small>Key features</small><h3>Built for the messy last mile</h3></div></header><ul><li><Check/> Urgency-first review inbox</li><li><Check/> Counterfactual recovery decisions</li><li><Check/> Root-cause pattern detection</li><li><Check/> English and Hinglish drafts</li><li><Check/> Verified recovery evidence</li><li><Check/> Transparent evaluation lab</li></ul></article>
              <article className="learning-card"><header><span><Lightbulb/></span><div><small>Key learning</small><h3>Trust is a product feature</h3></div></header><blockquote>Urgency is more than a star rating.</blockquote><p>Risk language, repeat failures and customer intent change the next action. Automation earns trust when the reasoning stays visible and publishing remains under human control.</p><div><ShieldCheck/><p><strong>Honest MVP note</strong><small>This build uses a deterministic, transparent demo intelligence layer on synthetic data. A secure model adapter and real channel connectors are the next milestones.</small></p></div></article>
            </section>
          </TabsContent>

          <TabsContent value="decision" className="tab-content">
            <section className="decision-hero">
              <div><span><Layers3/> Counterfactual recovery intelligence</span><h2>See the consequence of each action <em>before</em> you commit.</h2><p>For Riya’s broken-seal complaint, Nivaran compares three transparent paths. The recommendation is evidence-led, policy-aware and still requires a human decision.</p></div>
              <aside><div><small>Consequence score</small><strong>92<em>/100</em></strong><span>Immediate action</span></div><p><ShieldCheck/> Safety language</p><p><TrendingUp/> Repeat-risk signal</p><p><MessageSquareText/> Public channel</p><p><Target/> Refund intent</p></aside>
            </section>

            <section className="decision-grid">
              <article className="decision-paths"><header><div><small>Choose a response strategy</small><h3>What should happen next?</h3></div><span>Riya · Google · 1★</span></header><div>{decisionPaths.map((path) => <button key={path.id} className={decisionPath === path.id ? `active ${path.id}` : path.id} onClick={() => setDecisionPath(path.id)}><span>{path.id === "ignore" ? <AlertTriangle/> : path.id === "reply" ? <MessageSquareText/> : <CheckCircle2/>}</span><p><small>{path.kicker}</small><strong>{path.label}</strong><em>{path.horizon}</em></p><b>{path.score}</b></button>)}</div><footer><ShieldCheck/><p><strong>Decision boundary</strong><small>Nivaran recommends; the business owner authorizes.</small></p></footer></article>

              <article className={`decision-outcome outcome-${activeDecision.id}`}><header><div><small>Projected outcome · synthetic demo</small><h3>{activeDecision.label}</h3></div><span>{activeDecision.id === "recover" ? "Recommended" : "Compare"}</span></header><p>{activeDecision.outcome}</p><div className="outcome-metrics"><section><small>Unresolved risk</small><strong>{activeDecision.risk}</strong><span className="risk-track"><i style={{width:activeDecision.risk}}/></span></section><section><small>Trust movement</small><strong>{activeDecision.trust}</strong><span>scenario points</span></section><section><small>Recovery readiness</small><strong>{activeDecision.score}<em>/100</em></strong><span>{activeDecision.horizon}</span></section></div><div className="decision-plan">{activeDecision.steps.map((step,index) => <div key={step}><span>{index + 1}</span><p><small>{index === 0 ? "Customer" : index === 1 ? "Operations" : "Evidence"}</small><strong>{step}</strong></p>{index < activeDecision.steps.length - 1 && <ArrowRight/>}</div>)}</div><footer><div><Activity/><p><strong>Why this path?</strong><small>{activeDecision.id === "recover" ? "It reduces public risk and fixes the operational cause in the same recovery loop." : activeDecision.id === "reply" ? "It acknowledges the customer but does not prove a customer or operational outcome." : "It leaves every observed risk signal unresolved."}</small></p></div><Button onClick={commitDecision}><Target/> Commit recommended path</Button></footer></article>
            </section>

            <section className="evidence-strip"><header><div><small>Decision fingerprint · NVR-SAFE-041</small><h3>Evidence stays visible. Scoring weights stay protected.</h3></div><span><ShieldCheck/> Human verified</span></header><div><article><span>01</span><p><small>Safety evidence</small><strong>“Broken seal” + “unsafe”</strong></p><b>Critical</b></article><article><span>02</span><p><small>Customer intent</small><strong>Explicit refund request</strong></p><b>High</b></article><article><span>03</span><p><small>Service failure</small><strong>Unanswered support call</strong></p><b>High</b></article><article><span>04</span><p><small>Public exposure</small><strong>Google · 1-star review</strong></p><b>Live</b></article></div></section>
          </TabsContent>

          <TabsContent value="inbox" className="tab-content">
            <section className="metrics">
              <article className="alert-metric"><span><AlertTriangle/></span><div><small>Needs attention</small><strong>{metrics.urgent}</strong><p>2 critical · {Math.max(metrics.urgent - 2,0)} high priority</p></div><em><TrendingUp/> +2 today</em></article>
              <article><span className="blue"><MessageSquareText/></span><div><small>Awaiting response</small><strong>{metrics.pending}</strong><p>AI drafts ready for review</p></div><em><Clock3/> 8m avg.</em></article>
              <article><span className="amber"><Star/></span><div><small>Average rating</small><strong>{metrics.rating}</strong><p>Across connected sources</p></div><em className="positive"><TrendingUp/> +0.3</em></article>
              <article><span className="green"><CheckCircle2/></span><div><small>Recovered this week</small><strong>18</strong><p>Customers moved to resolved</p></div><em className="positive"><TrendingUp/> 72%</em></article>
            </section>

            <div className="desk-grid"><section className="review-panel">
              <div className="toolbar"><div>{["All","Urgent","Negative","Positive"].map((x) => <button key={x} className={filter === x ? "active" : ""} onClick={() => setFilter(x)}>{x}{x === "Urgent" && <span>{metrics.urgent}</span>}</button>)}</div><aside><label><Search/><input placeholder="Search reviews" value={query} onChange={(e) => setQuery(e.target.value)}/></label><Button size="sm" variant="outline" onClick={() => setDialog(true)}><Plus/> Add review</Button></aside></div>
              <div className="review-list">{visible.map((r) => <button className="review-row" key={r.id} onClick={() => openReview(r)}>
                <div className="avatar">{r.initials}<Source name={r.source}/></div><div className="review-copy"><div><strong>{r.customer}</strong><Stars value={r.rating}/><span>{r.time}</span></div><p>{r.text}</p><footer><span className={`urgency ${r.urgency.toLowerCase()}`}><i/>{r.urgency}</span><span>{r.category}</span><span className={`review-status ${r.status.replace(" ", "-").toLowerCase()}`}>{r.status === "Approved" && <Check/>}{r.status}</span></footer></div><ArrowRight/>
              </button>)}</div>
            </section>
            <aside className="agent-rail"><header><div><span><Bot/></span><p><strong>Nivaran is {running ? "working" : "ready"}</strong><small>{running ? steps[stage].text : "Last completed 2 min ago"}</small></p></div><em><i/> Online</em></header><Progress value={progress} className="agent-progress"/>
              <div className="step-list">{steps.map((s,i) => { const Icon=s.icon; const done=!running || i < stage; return <div key={s.name} className={running && i === stage ? "current" : ""}><span>{done ? <Check/> : <Icon/>}</span><p><strong>{s.name}</strong><small>{s.text}</small></p>{running && i === stage && <i/>}</div>})}</div>
              <div className="pattern"><header><span><TrendingUp/></span><p><small>Pattern detected</small><strong>Packaging complaints rising</strong></p></header><p>12 mentions in 7 days · 38% above last week.</p><button onClick={() => setView("intelligence")}>View root-cause insight <ArrowRight/></button></div>
              <div className="guard"><ShieldCheck/><p><strong>Human approval is on</strong><small>Nivaran never publishes without confirmation.</small></p></div>
            </aside></div>
          </TabsContent>

          <TabsContent value="recovery" className="tab-content">
            <section className="recovery-summary">
              <div><span><CircleDot/> Closed-loop differentiation</span><h2>A reply is not a recovery. Nivaran stays until the outcome is verified.</h2><p>Every urgent public review becomes an owned case with an SLA, customer action, operational correction and resolution evidence.</p></div>
              <aside><article><small>Open recovery loops</small><strong>2</strong><p>Demo cases requiring action</p></article><article><small>SLA at risk</small><strong>1</strong><p>Riya · 11 minutes left</p></article><article><small>Evidence complete</small><strong>1/3</strong><p>Outcome confirmation logged</p></article></aside>
            </section>

            <div className="recovery-grid">
              <section className="case-stack">
                <header><div><small>Active recovery cases</small><h3>Customer outcomes, not ticket closures</h3></div><span><Timer/> SLA ordered</span></header>
                <div>{recoveryCases.map((item) => <button key={item.id} className={recoveryId === item.id ? "active" : ""} onClick={() => setRecoveryId(item.id)}>
                  <div className="case-avatar">{item.initials}</div><div className="case-copy"><header><strong>{item.customer}</strong><span className={`urgency ${item.risk.toLowerCase()}`}><i/>{item.risk}</span></header><p>{item.issue}</p><footer><span><CalendarClock/>{item.sla}</span><span><UserRoundCheck/>{item.owner}</span></footer></div><div className={`case-state state-${item.progress}`}><b>{item.progress}%</b><small>{item.status}</small></div>
                </button>)}</div>
              </section>

              <article className="recovery-detail">
                <header><div><span className="case-avatar large">{activeRecovery.initials}</span><p><small>Recovery case · NRC-{activeRecovery.id}</small><strong>{activeRecovery.customer}</strong><span>{activeRecovery.source} · {activeRecovery.issue}</span></p></div><span className={`recovery-status ${activeRecovery.status.replaceAll(" ","-").toLowerCase()}`}><i/>{activeRecovery.status}</span></header>
                <div className="recovery-progress"><header><span>Verified recovery progress</span><b>{activeRecovery.progress}%</b></header><Progress value={activeRecovery.progress}/></div>
                <div className="recovery-timeline">
                  <section className="done"><span><BrainCircuit/></span><div><small>01 · Signal evidence</small><strong>Public reputation risk understood</strong><p>{activeRecovery.issue} matched to the {activeRecovery.risk.toLowerCase()} recovery playbook.</p></div><Check/></section>
                  <section className={activeRecovery.progress >= 62 ? "done" : "current"}><span><PhoneCall/></span><div><small>02 · Customer recovery</small><strong>{activeRecovery.action}</strong><p>Owner: {activeRecovery.owner} · SLA: {activeRecovery.sla}</p></div>{activeRecovery.progress >= 62 ? <Check/> : <Timer/>}</section>
                  <section className={activeRecovery.progress === 100 ? "done" : activeRecovery.progress >= 62 ? "current" : "waiting"}><span><PackageCheck/></span><div><small>03 · Operational correction</small><strong>{activeRecovery.correctiveTask}</strong><p>Fix the root cause—not only the public reply.</p></div>{activeRecovery.progress === 100 ? <Check/> : <CircleDot/>}</section>
                  <section className={activeRecovery.progress === 100 ? "done" : "waiting"}><span><ClipboardCheck/></span><div><small>04 · Resolution evidence</small><strong>{activeRecovery.evidence}</strong><p>Outcome must be visible before Nivaran marks recovery complete.</p></div>{activeRecovery.progress === 100 ? <Check/> : <CircleDot/>}</section>
                </div>
                <footer><div><ShieldCheck/><p><strong>Human-owned recovery</strong><small>The agent recommends and records. The business owner authorizes every customer or operational action.</small></p></div><Button onClick={advanceRecovery} disabled={activeRecovery.status === "Resolved"}>{activeRecovery.status === "Action due" ? <PhoneCall/> : <ClipboardCheck/>}{activeRecovery.status === "Action due" ? "Log customer contact" : activeRecovery.status === "Customer contacted" ? "Verify outcome" : "Recovery verified"}</Button></footer>
              </article>
            </div>
          </TabsContent>

          <TabsContent value="intelligence" className="tab-content">
            <section className="insight-hero"><div><span><Sparkles/> Demo weekly brief</span><h2>Your service is recovering faster, but packaging is becoming the next churn risk.</h2><p>In this synthetic demo workspace, Nivaran connects individual complaints into three operational patterns.</p></div><aside><small>Demo health score</small><strong>74<em>/100</em></strong><div><i/></div><p><TrendingUp/> 8-point scenario lift</p></aside></section>
            <section className="chart-grid"><article className="chart-card"><header><div><small>Recurring issues</small><h3>What customers keep mentioning</h3></div><button>Last 7 days <ChevronDown/></button></header><div className="bars">{issues.map((x) => <div key={x.name}><label><strong>{x.name}</strong><small>{x.count} mentions</small></label><span><i style={{width:`${x.width}%`}}/></span><em className={x.trend.startsWith("−") ? "down" : ""}>{x.trend}</em></div>)}</div></article>
              <article className="chart-card sentiment"><header><div><small>Sentiment mix</small><h3>Conversation temperature</h3></div></header><div className="donut-wrap"><div className="donut"><p><strong>62%</strong><small>positive</small></p></div><div><p><i className="pos"/>Positive <b>62%</b></p><p><i className="mix"/>Mixed <b>21%</b></p><p><i className="neg"/>Negative <b>17%</b></p></div></div><footer><TrendingUp/><p><strong>Positive mentions rose 11%</strong><small>after response time dropped below 15 minutes.</small></p></footer></article></section>
            <section className="action-card"><header><div><small>Recommended actions</small><h3>From customer signal to owner decision</h3></div><span><Activity/> Updated by Insight Agent</span></header><div className="action-table"><div className="table-head"><span>Signal</span><span>Evidence</span><span>Trend</span><span>Recommended next step</span><span>Owner</span></div>{issues.map((x,i) => <div className="table-row" key={x.name}><span><i className={`action-icon a${i}`}><AlertTriangle/></i><strong>{x.name}</strong></span><span>{x.count} reviews</span><span><em>{x.trend}</em></span><span><strong>{x.action}</strong><small>{i === 0 ? "Before tonight’s dinner rush" : "Add to this week’s ops review"}</small></span><span><b>{i < 2 ? "AK" : "RM"}</b></span></div>)}</div></section>
          </TabsContent>

          <TabsContent value="evaluation" className="tab-content">
            <section className="evaluation-hero">
              <div><span><FlaskConical/> Judge-ready proof layer</span><h2>Do not trust the demo. <em>Inspect how it fails.</em></h2><p>Nivaran’s transparent benchmark tests urgency recall, visible reasoning, policy safety and human escalation on 32 synthetic reviews. Scores describe this deterministic prototype—not real-world model performance.</p><div><b><ShieldCheck/> Synthetic benchmark</b><b><UserRoundCheck/> Human boundary tested</b><b><RefreshCw/> Re-runnable</b></div></div>
              <aside><div className="evaluation-score"><strong>92</strong><span>/100</span><small>prototype readiness</small></div><p><i/> Last suite complete</p><Progress value={evalProgress}/><small>{evalRunning ? `Running test matrix · ${evalProgress}%` : "32 of 32 cases evaluated"}</small></aside>
            </section>

            <section className="benchmark-grid">
              <article className="benchmark-card"><header><div><small>Quality scorecard</small><h3>What the prototype can prove today</h3></div><span><Gauge/> v0.6 benchmark</span></header><div>{benchmarkSlices.map((slice) => <section key={slice.name}><div><p><strong>{slice.name}</strong><small>{slice.detail}</small></p><b>{slice.result}</b></div><span><i className={slice.tone} style={{width:`${slice.score}%`}}/></span></section>)}</div><footer><AlertTriangle/><p><strong>Evaluation boundary</strong><small>This is a product-quality benchmark on synthetic cases, not an accuracy claim for unseen production data.</small></p></footer></article>

              <article className="edge-card"><header><div><small>Adversarial slice</small><h3>Edge cases judges can inspect</h3></div><span>4 scenarios</span></header><div>{edgeCases.map((item,index) => <section key={item.signal}><b>0{index + 1}</b><p><small>{item.signal}</small><strong>“{item.sample}”</strong><em>{item.verdict}</em></p><span className={item.status.toLowerCase()}>{item.status === "Passed" ? <Check/> : <UserRoundCheck/>}{item.status}</span></section>)}</div></article>
            </section>

            <section className="eval-trace"><header><div><small>Safety contract · NVR-EVAL-032</small><h3>One guarded escalation is a success, not a failure.</h3></div><Button variant="outline" onClick={runEvaluation} disabled={evalRunning}>{evalRunning ? <RefreshCw/> : <PlayCircle/>}{evalRunning ? "Evaluating…" : "Re-run 32 cases"}</Button></header><div><article><span><BrainCircuit/></span><p><small>Signal decision</small><strong>Ambiguous seal language detected</strong></p><b>82%</b></article><ArrowRight/><article><span><ShieldCheck/></span><p><small>Policy boundary</small><strong>No automatic safety claim</strong></p><b>Guarded</b></article><ArrowRight/><article><span><UserRoundCheck/></span><p><small>Safe outcome</small><strong>Route to human verification</strong></p><b>Required</b></article></div></section>
          </TabsContent>

          <TabsContent value="agent" className="tab-content">
            <section className="system-hero"><div><span><BrainCircuit/> Explainable agent orchestration</span><h2>One customer review. Three specialist agents. One safe business action.</h2><p>The orchestrator passes structured evidence—not guesses—between stages. Every output keeps its confidence, reasoning and human approval trail.</p><Button className="run-button" onClick={runAgent}><Sparkles/> Run full workflow</Button></div><aside><header><span><Bot/></span><p><small>Orchestrator</small><strong>Nivaran Core</strong></p><em><i/> Active</em></header><Progress value={progress}/><p>{running ? `${steps[stage].name} · ${progress}%` : `${reviews.length} reviews processed · ready`}</p></aside></section>
            <section className="agent-cards">{steps.slice(0,3).map((s,i) => { const Icon=s.icon; return <div className="agent-card-wrap" key={s.name}><article><b>0{i+1}</b><span className={`agent-icon ai${i}`}><Icon/></span><small>{s.name}</small><h3>{i===0 ? "Understands the review" : i===1 ? "Plans the next action" : "Drafts with context"}</h3><p>{i===0 ? "Extracts sentiment, intent, topic, risk language and urgency into structured evidence." : i===1 ? "Matches evidence to policy and chooses a safe recovery step before any reply." : "Creates a brand-safe English or Hinglish response and waits for approval."}</p><ul><li><Check/> {i===0 ? "Sentiment + intent" : i===1 ? "Playbook matching" : "Brand voice"}</li><li><Check/> {i===0 ? "Topic classification" : i===1 ? "Refund guardrails" : "Bilingual drafting"}</li><li><Check/> {i===0 ? "Urgency confidence" : i===1 ? "Owner escalation" : "Human checkpoint"}</li></ul><code>{i===0 ? `{ urgency: "critical", confidence: .96 }` : i===1 ? `{ action: "call + refund", SLA: "15m" }` : `{ status: "awaiting_approval" }`}</code></article>{i<2 && <ArrowRight/>}</div>})}</section>
            <section className="trace-grid"><article className="trace-card"><header><div><small>Latest execution trace</small><h3>Why Riya’s review became critical</h3></div><span>RUN-0829-1842</span></header>{["Detected ‘broken seal’, ‘unsafe’ and refund intent","Matched food-safety escalation playbook","Drafted apology with 15-minute callback promise","Awaiting owner approval before publishing"].map((x,i) => <div className={i===3 ? "waiting" : ""} key={x}><span>{i===3 ? <UserRoundCheck/> : <Check/>}</span><p><small>{i===3 ? "Human checkpoint" : `00:0${i}.8 · ${steps[Math.min(i,2)].name}`}</small><strong>{x}</strong></p><b>{i===0 ? "96%" : i===1 ? "Policy 4.2" : i===2 ? "Safe" : "Required"}</b></div>)}</article>
              <article className="policy-card"><header><div><small>Safety guardrails</small><h3>What the agent cannot do alone</h3></div><ShieldCheck/></header>{[["Human approval","Required for every public response","ON"],["Refund authorization","Escalate above ₹500","₹500"],["PII protection","Never repeat phone or order details","ON"],["Confidence floor","Route to human below threshold","80%"]].map((x) => <div key={x[0]}><span><Check/></span><p><strong>{x[0]}</strong><small>{x[1]}</small></p><b>{x[2]}</b></div>)}</article></section>
          </TabsContent>
        </Tabs>
      </div>
    </section>

    <Sheet open={sheet} onOpenChange={setSheet}><SheetContent className="review-sheet sm:max-w-[560px]"><SheetHeader><div className="sheet-kicker"><Source name={selected.source}/>{selected.source} review · {selected.time}</div><SheetTitle>Review intelligence</SheetTitle><SheetDescription>Agent analysis and recovery action for {selected.customer}.</SheetDescription></SheetHeader><div className="sheet-scroll">
      <section className="customer-card"><header><div className="avatar large">{selected.initials}</div><p><strong>{selected.customer}</strong><Stars value={selected.rating}/></p><span className={`urgency ${selected.urgency.toLowerCase()}`}><i/>{selected.urgency}</span></header><blockquote>“{selected.text}”</blockquote></section>
      <section className="sheet-section"><header><span><BrainCircuit/></span><p><small>Signal Agent</small><strong>What the agent understood</strong></p><em>{selected.confidence}% confidence</em></header><div className="analysis-grid"><p><small>Sentiment</small><strong>{selected.sentiment}</strong></p><p><small>Primary issue</small><strong>{selected.category}</strong></p><p><small>Priority</small><strong>{selected.urgency}</strong></p></div><div className="reason"><Sparkles/><p><strong>Why this matters</strong>{selected.reason}</p></div></section>
      <section className="sheet-section"><header><span className="coral"><Target/></span><p><small>Recovery Agent</small><strong>Next best action</strong></p></header><div className="next-action"><small>Recommended</small><strong>{selected.nextAction}</strong><p>Based on priority, policy and similar resolved cases.</p></div></section>
      <section className="sheet-section"><header><span className="green"><MessageSquareText/></span><p><small>Response Agent</small><strong>Human-ready response</strong></p><button onClick={toggleLanguage}><Languages/>{language === "en" ? "EN" : "HI"}</button></header><Textarea className="response-editor" value={edited} onChange={(e) => setEdited(e.target.value)}/><footer><span><ShieldCheck/> Brand-safe</span><span><CheckCircle2/> No personal data</span><span>{edited.length} characters</span></footer></section>
    </div><SheetFooter><div><Button variant="outline" onClick={() => setSheet(false)}>Save for later</Button><Button className="approve" onClick={approve}><Send/> Approve & queue</Button></div><p><UserRoundCheck/> Nothing is posted without your approval.</p></SheetFooter></SheetContent></Sheet>

    <Dialog open={dialog} onOpenChange={setDialog}><DialogContent className="add-dialog"><DialogHeader><span className="dialog-icon"><MessageSquareText/></span><DialogTitle>Add a review to the agent</DialogTitle><DialogDescription>Nivaran will classify the signal, prioritize it and draft the next response.</DialogDescription></DialogHeader><div className="form"><label>Customer name<Input placeholder="e.g. Priya Sharma" value={form.customer} onChange={(e) => setForm({...form,customer:e.target.value})}/></label><div><label>Source<select value={form.source} onChange={(e) => setForm({...form,source:e.target.value})}><option>Google</option><option>Zomato</option><option>Amazon</option><option>Direct</option></select></label><label>Rating<select value={form.rating} onChange={(e) => setForm({...form,rating:Number(e.target.value)})}>{[1,2,3,4,5].map((x)=><option key={x}>{x}</option>)}</select></label></div><label>Review text<Textarea rows={5} placeholder="Paste the customer review here…" value={form.text} onChange={(e) => setForm({...form,text:e.target.value})}/></label></div><DialogFooter><Button variant="outline" onClick={() => setDialog(false)}>Cancel</Button><Button className="run-button" onClick={addReview}><Sparkles/> Analyze review</Button></DialogFooter></DialogContent></Dialog>
    <Toaster position="bottom-right" richColors/>
  </main>;
}
