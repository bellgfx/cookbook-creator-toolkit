import React, { useState, useEffect } from "react";
import { BookOpen, Compass, ClipboardList, Sparkles, AlertTriangle, Play, CheckCircle2, ChevronRight, Menu, X, RotateCcw, Lock } from "lucide-react";
import HomeModule from "./components/HomeModule";
import Module1Concept from "./components/Module1Concept";
import Module2Dietary from "./components/Module2Dietary";
import Module3Design from "./components/Module3Design";
import Module4Canva from "./components/Module4Canva";
import Module5Recipes from "./components/Module5Recipes";
import Module6Publishing from "./components/Module6Publishing";
import Module7Marketing from "./components/Module7Marketing";
import { GlobalState } from "./types";

const INITIAL_STATE: GlobalState = {
  authorName: "",
  title: "",
  motivation: "Specialty Chef",
  motivationText: "",
  audience: ["Families with Allergies"],
  audienceText: "",
  themes: ["Garden Harvest", "Rural Heritage"],
  themeText: "",
  angles: ["Backyard Grilling Swap", "Dutch Oven Baking"],
  angleText: "",
  scale: "",
  formats: [],
  finalNotes: "",
  aiTitles: [],
  nicheAnalysis: null,
  primaryBadge: null,
  primaryType: "standard",
  secondaryBadges: [],
  customBadges: [],
  orderedBadges: [
    { label: "AGS Safe", type: "ags" },
    { label: "Gluten-Free", type: "secondary" },
    { label: "Dairy-Free", type: "secondary" }
  ],
  selectedStyleId: "farmhouse",
  aiDesignRecommendation: null,
  recipes: [],
  currentRecipeDraft: null,
  canvaChecklistState: {},
  publishingChecklistState: {},
  marketingChecklistState: {},
};

const MODULES_MAP = [
  { id: 0, label: "Workbook Concept", sub: "Branding & Niche Target" },
  { id: 1, label: "Concept Planner", sub: "Audience & AI Title Thesis" },
  { id: 2, label: "Diet Badge Engine", sub: "Safety Priority Badging" },
  { id: 3, label: "Art Direction Boards", sub: "Brand Palettes & AI Styling" },
  { id: 4, label: "Canva Design Rules", sub: "Trim Specs & Pre-export Prep" },
  { id: 5, label: "Recipe Card Interior", sub: "Safety Live formatting & Print" },
  { id: 6, label: "KDP Economics", sub: "Royalties & KDP Keywords" },
  { id: 7, label: "Launch Marketing Kit", sub: "TikTok Scripts & Storyboards" }
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("cookbook_creator_authenticated") === "true";
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const [state, setState] = useState<GlobalState>(() => {
    const saved = localStorage.getItem("cookbook_creator_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          orderedBadges: parsed.orderedBadges || INITIAL_STATE.orderedBadges,
          recipes: parsed.recipes || INITIAL_STATE.recipes,
          canvaChecklistState: parsed.canvaChecklistState || INITIAL_STATE.canvaChecklistState,
          publishingChecklistState: parsed.publishingChecklistState || INITIAL_STATE.publishingChecklistState,
          marketingChecklistState: parsed.marketingChecklistState || INITIAL_STATE.marketingChecklistState,
        };
      } catch (e) {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  const [currentModule, setCurrentModule] = useState<number>(() => {
    const saved = localStorage.getItem("cookbook_creator_module");
    if (saved) {
      const idx = parseInt(saved, 10);
      return isNaN(idx) ? 0 : idx;
    }
    return 0;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError("Please enter your premium passkey.");
      return;
    }
    setAuthError("");
    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("cookbook_creator_authenticated", "true");
        setAuthError("");
      } else {
        setAuthError(data.message || "Invalid passkey.");
      }
    } catch (err) {
      // In development or network hiccup, check local fallback so they are never locked out of testing
      if (passwordInput.trim() === "LetsCreate@2026") {
        setIsAuthenticated(true);
        localStorage.setItem("cookbook_creator_authenticated", "true");
        setAuthError("");
      } else {
        setAuthError("Could not connect to authentication server. Please try again later.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to lock the workspace? You will need your passkey to log back in.")) {
      setIsAuthenticated(false);
      localStorage.removeItem("cookbook_creator_authenticated");
      setPasswordInput("");
    }
  };

  useEffect(() => {
    localStorage.setItem("cookbook_creator_state", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem("cookbook_creator_module", currentModule.toString());
  }, [currentModule]);

  const updateState = (fields: Partial<GlobalState>) => {
    setState((prev) => ({ ...prev, ...fields }));
  };

  const handleNavigate = (moduleIndex: number) => {
    setCurrentModule(moduleIndex);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetData = () => {
    if (confirm("Reset layout workspace drafts and start fresh? This wipes cached recipes.")) {
      localStorage.removeItem("cookbook_creator_state");
      localStorage.removeItem("cookbook_creator_module");
      setState(INITIAL_STATE);
      setCurrentModule(0);
    }
  };

  const renderModuleContent = () => {
    switch (currentModule) {
      case 0:
        return (
          <HomeModule
            authorName={state.authorName}
            title={state.title}
            onNavigate={handleNavigate}
          />
        );
      case 1:
        return <Module1Concept state={state} updateState={updateState} onNavigate={handleNavigate} />;
      case 2:
        return <Module2Dietary state={state} updateState={updateState} onNavigate={handleNavigate} />;
      case 3:
        return <Module3Design state={state} updateState={updateState} onNavigate={handleNavigate} />;
      case 4:
        return <Module4Canva state={state} updateState={updateState} onNavigate={handleNavigate} />;
      case 5:
        return <Module5Recipes state={state} updateState={updateState} onNavigate={handleNavigate} />;
      case 6:
        return <Module6Publishing state={state} updateState={updateState} onNavigate={handleNavigate} />;
      case 7:
        return <Module7Marketing state={state} updateState={updateState} onNavigate={handleNavigate} />;
      default:
        return (
          <HomeModule
            authorName={state.authorName}
            title={state.title}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  // Progress Percent calculated on Module Navigation completed states
  const overallProgressPercent = Math.min(
    100,
    Math.round((currentModule / (MODULES_MAP.length - 1)) * 100)
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6 font-sans select-none antialiased">
        <div className="w-full max-w-md bg-white border border-lightgray rounded-3xl p-8 shadow-xl space-y-8 relative overflow-hidden">
          {/* Subtle design accents in background */}
          <div className="absolute top-0 left-0 w-2 h-full bg-sagedark" />
          <div className="absolute -right-12 -top-12 w-28 h-28 bg-[#EEF5EF] rounded-full blur-xl" />
          
          <div className="text-center space-y-3">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-[#EEF5EF] border border-[#D5E6D8] flex items-center justify-center text-sagedark shadow-inner">
              <span className="font-serif font-black text-2xl">C</span>
            </div>
            
            <div className="space-y-1">
              <h1 className="font-serif text-2xl font-black text-charcoal">
                Cookbook Creator Toolkit
              </h1>
              <p className="text-[10px] font-bold text-midgray tracking-widest uppercase">
                Premium Author Workspace
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-charcoal block uppercase tracking-wide">
                Premium Access Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter your security passkey"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  disabled={isVerifying}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-lightgray focus:border-sagedark focus:ring-1 focus:ring-sagedark bg-[#FAF7F2]/50 text-charcoal font-medium text-sm transition-all outline-hidden text-center placeholder:text-neutral-400"
                />
              </div>
              
              {authError && (
                <div className="flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-xs font-medium">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 bg-sagedark hover:bg-sagedark/90 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-sage/40"
            >
              {isVerifying ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
                  Verifying Security...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current text-white" />
                  Unlock Creator Workspace
                </>
              )}
            </button>
          </form>

          <div className="border-t border-lightgray pt-6 text-center space-y-2">
            <p className="text-[11px] text-midgray leading-relaxed">
              This toolkit is password-protected for premium users. Please enter your custom premium passkey to access your workspace.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-charcoal select-none antialiased">
      {/* Upper Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-lightgray/55 py-3.5 px-4 sm:px-6 flex items-center justify-between shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-midgray hover:bg-neutral-100"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>

          <div
            onClick={() => handleNavigate(0)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="h-8 w-8 rounded-lg bg-sagedark flex items-center justify-center text-white font-serif font-black shadow-inner">
              C
            </div>
            <div>
              <h1 className="font-serif text-sm font-black text-charcoal leading-none group-hover:text-sagedark transition-colors">
                Cookbook Creator Toolkit
              </h1>
              <span className="text-[9px] font-bold text-midgray tracking-widest uppercase block mt-1">
                2026 Indie Cookbook Author Board
              </span>
            </div>
          </div>
        </div>

        {/* Global Stats block indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2.5 bg-mentor-bg px-3.5 py-1.5 rounded-full border border-sagelight/35">
            <span className="live-dot" />
            <span className="font-bold text-sagedark uppercase text-[9px] tracking-wider">
              {state.title ? `Working title: ${state.title}` : "Planning active..."}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Lock Workspace"
            className="p-1.5 rounded-lg border border-lightgray text-midgray hover:text-sagedark hover:border-sagelight transition-colors bg-white shadow-xs cursor-pointer"
          >
            <Lock className="h-4 w-4" />
          </button>

          <button
            onClick={handleResetData}
            title="Reset Workspace"
            className="p-1.5 rounded-lg border border-lightgray text-midgray hover:text-red-500 hover:border-red-200 transition-colors bg-white shadow-xs"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main layout container with sidebar navigation drawer */}
      <div className="flex-1 flex relative">
        {/* Deskop Sidebar & Mobile Drawer Cover */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-16 md:h-[calc(100vh-4rem)] w-64 border-r border-lightgray/55 bg-white flex flex-col justify-between shrink-0 shadow-sm md:shadow-none transition-transform duration-300 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } print:hidden`}
        >
          <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
            {/* Mobile Close Button */}
            <div className="flex md:hidden items-center justify-between border-b pb-2 mb-2">
              <span className="font-serif font-black text-xs text-charcoal">Sections Map</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-md text-midgray hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Overall campaign progress indicator */}
            <div className="bg-[#FAF7F2] p-4 rounded-xl border border-lightgray/50 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-sagedark block uppercase tracking-wider">
                <span>Core Milestones</span>
                <span>{overallProgressPercent}%</span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sagedark transition-all duration-300"
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>
            </div>

            <nav className="space-y-1">
              {MODULES_MAP.map((mod) => {
                const isCurrent = currentModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => handleNavigate(mod.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                      isCurrent
                        ? "bg-mentor-bg/75 border-sagedark/30 text-sagedark shadow-inner"
                        : "bg-transparent border-transparent text-midgray hover:bg-sage/5 hover:text-charcoal"
                    }`}
                  >
                    <span
                      className={`h-6 w-6 rounded-full border flex items-center justify-center text-xs font-serif font-bold ${
                        isCurrent ? "bg-sagedark border-sagedark text-white" : "border-neutral-300 text-midgray"
                      }`}
                    >
                      {mod.id === 0 ? "★" : mod.id}
                    </span>

                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-bold leading-tight truncate">{mod.label}</span>
                      <span className="block text-[9px] text-midgray leading-none mt-1 truncate">{mod.sub}</span>
                    </div>

                    <ChevronRight className={`h-4 w-4 text-neutral-300 ${isCurrent ? "opacity-100" : "opacity-0"}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-lightgray/40 text-center text-[10px] text-midgray">
            Cookbook Creator · Version 2026.1 <br />
            Secure Client Workspace Cache Active
          </div>
        </aside>

        {/* Mobile Sidebar overlay backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-neutral-900/40 md:hidden transition-opacity"
          />
        )}

        {/* Dynamic Workspace Container Section */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-5xl mx-auto print:p-0 print:overflow-visible">
          {renderModuleContent()}
        </main>
      </div>
    </div>
  );
}
