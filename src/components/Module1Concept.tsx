import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, Lightbulb, Compass, Save, Check, Copy, Edit3 } from "lucide-react";
import { GlobalState, TitleSuggestion, NicheAnalysis } from "../types";

interface Module1Props {
  state: GlobalState;
  updateState: (fields: Partial<GlobalState>) => void;
  onNavigate: (module: number) => void;
}

export default function Module1Concept({ state, updateState, onNavigate }: Module1Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [isAnalyzingNiche, setIsAnalyzingNiche] = useState(false);
  const [aiError, setAiError] = useState("");

  const [copied, setCopied] = useState(false);
  const [isEditingNiche, setIsEditingNiche] = useState(false);
  
  // Local edit states for niche audit
  const [editedNiche, setEditedNiche] = useState<string>("");
  const [editedCategories, setEditedCategories] = useState<string>("");
  const [editedKeywords, setEditedKeywords] = useState<string>("");
  const [editedStrengths, setEditedStrengths] = useState<string>("");
  const [editedSuggestions, setEditedSuggestions] = useState<string>("");

  // Sync edit states when state.nicheAnalysis changes
  useEffect(() => {
    if (state.nicheAnalysis) {
      setEditedNiche(state.nicheAnalysis.primaryNiche || "");
      setEditedCategories((state.nicheAnalysis.amazonCategories || []).join("\n"));
      setEditedKeywords((state.nicheAnalysis.keywords || []).join(", "));
      setEditedStrengths((state.nicheAnalysis.strengths || []).join("\n"));
      setEditedSuggestions((state.nicheAnalysis.suggestions || []).join("\n"));
    }
  }, [state.nicheAnalysis]);

  const handleCopyNicheText = () => {
    if (!state.nicheAnalysis) return;
    const text = `### STRATEGIC NICHE AUDIT REPORT ###
Primary Niche: ${state.nicheAnalysis.primaryNiche}

Top Amazon Browse Categories:
${state.nicheAnalysis.amazonCategories.map((c, i) => `${i+1}. ${c}`).join("\n")}

Auto KDP Search Keywords:
${state.nicheAnalysis.keywords.join(", ")}

Concept Strengths:
${state.nicheAnalysis.strengths.map((s, i) => `- ${s}`).join("\n")}

Audit Considerations:
${state.nicheAnalysis.suggestions.map((s, i) => `- ${s}`).join("\n")}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveNicheEdits = () => {
    const updated = {
      primaryNiche: editedNiche,
      amazonCategories: editedCategories.split("\n").map(s => s.trim()).filter(Boolean),
      keywords: editedKeywords.split(",").map(s => s.trim()).filter(Boolean),
      strengths: editedStrengths.split("\n").map(s => s.trim()).filter(Boolean),
      suggestions: editedSuggestions.split("\n").map(s => s.trim()).filter(Boolean)
    };
    updateState({ nicheAnalysis: updated });
    setIsEditingNiche(false);
    alert("Strategic Niche Audit edits saved successfully! ✓");
  };

  const TOTAL_STEPS = 9;

  // Step names
  const stepsMeta = [
    { title: "Introduction", desc: "Welcome from your Cookbook Mentor" },
    { title: "Author Profile", desc: "Who is writing this cookbook?" },
    { title: "Mission & Spark", desc: "Why does this book need to exist?" },
    { title: "Ideal Reader", desc: "Who is this cookbook built for?" },
    { title: "Core Theme", desc: "The flavor and visual personality" },
    { title: "Your Story & Angle", desc: "Your background and survivor notes" },
    { title: "Page Format", desc: "Size and publishing medium" },
    { title: "Book Title", desc: "Give your project a name" },
    { title: "Launch Blueprint", desc: "Complete Concept Summary" }
  ];

  const motivationsOptions = [
    "A health journey changed how I eat",
    "I want to share family heirloom recipes",
    "My dietary restrictions made me get creative",
    "I grow or raise my own fresh organic foods",
    "I want to help other survivor/caregiver communities eat better",
    "I have an established food blog or social media following",
    "I want to leave a meaningful legacy gift for my children and grandkids"
  ];

  const audienceOptions = [
    "Busy families and parents",
    "Sufferers of Alpha-Gal Syndrome (mammal allergy)",
    "Cancer patients, survivors, and oncology caregivers",
    "Health-conscious beginners",
    "Seasoned home cooks craving organic/whole foods",
    "Gardeners and backyard homesteaders",
    "Seniors and empty nesters"
  ];

  const themeOptions = [
    "Allergy-Free / Alpha-Gal Safe",
    "Garden-to-Table / Backyard Farm Fresh",
    "Cancer Recovery and Immunity Healing",
    "Clean Eating & Whole Foods",
    "Quick and Easy 30-Minute Dinners",
    "Comfort Food Made Gluten/Dairy Free",
    "Holistic Infusions, Smoothies & Tonics",
    "Legacy Family Heritage Baking"
  ];

  const anglesOptions = [
    "My personal survivor/recovery health journey",
    "An underserved medical dietary community",
    "Combining two distinct dietary criteria in one book",
    "Decades of professional or seasoned farm kitchen wisdom",
    "My literal garden or homestead as the source of life",
    "Recipes verified and approved by picky grandchildren"
  ];

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ── CALL SERVER-SIDE AI: Generate Titles ──
  const handleGenerateTitles = async () => {
    setIsGeneratingTitles(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/generate-titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: state.authorName,
          motivation: state.motivationText || state.motivation,
          audience: state.audience,
          themes: state.themes,
          angle: state.angleText || state.angles.join(", ")
        })
      });
      if (!response.ok) throw new Error("Server error while generating title options");
      const data: TitleSuggestion[] = await response.json();
      updateState({ aiTitles: data });
    } catch (err: any) {
      setAiError(err.message || "Failed to reach AI. Please input a title manually.");
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  // ── CALL SERVER-SIDE AI: Analyze Niche ──
  const handleAnalyzeNiche = async () => {
    setIsAnalyzingNiche(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/design-recommendation", { // wait, let's call the correct endpoint: /api/ai/analyze-niche
        // Wait, looking at server.ts, the endpoint for niche analysis is `/api/ai/analyze-niche`? Let's check server.ts!
        // Ah, let's see. In server.ts we defined:
        // - `/api/ai/generate-titles`
        // - `/api/ai/analyze-niche`
        // Wait, let's verify what endpoints we defined in `/server.ts`!
        // Let's call `/api/ai/analyze-niche`
      });
    } catch {}
    // Let's verify server.ts code. I wrote `/api/ai/analyze-niche` in server.ts! Yes! Let's call that.
  };

  const handleGetNicheAnalysis = async () => {
    setIsAnalyzingNiche(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/analyze-niche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: state.authorName,
          title: state.title,
          motivation: state.motivationText || state.motivation,
          audience: [...state.audience, state.audienceText].filter(Boolean),
          themes: [...state.themes, state.themeText].filter(Boolean),
          angle: [...state.angles, state.angleText].filter(Boolean),
          scale: state.scale,
          formats: state.formats,
          finalNotes: state.finalNotes
        })
      });
      if (!response.ok) throw new Error("Server error analyzing niche strategy");
      const data: NicheAnalysis = await response.json();
      updateState({ nicheAnalysis: data });
    } catch (err: any) {
      setAiError(err.message || "Failed to analyze niche. You can continue without it!");
    } finally {
      setIsAnalyzingNiche(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Top Wizard Steps Overview */}
      <div className="rounded-2xl bg-warmwhite p-3 border border-lightgray/60 shadow-sm flex items-center justify-between gap-1 md:gap-1.5 overflow-x-auto no-scrollbar">
        {stepsMeta.map((s, idx) => (
          <div key={idx} className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setCurrentStep(idx)}
              title={s.title}
              className={`flex h-6.5 w-6.5 sm:h-7 sm:w-7 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold transition-all ${
                currentStep === idx
                  ? "bg-sagedark text-white ring-2 ring-sagelight/20"
                  : currentStep > idx
                  ? "bg-sage text-white"
                  : "bg-lightgray text-midgray"
              }`}
            >
              {currentStep > idx ? <Check className="h-3 w-3" /> : idx + 1}
            </button>
            {currentStep === idx && (
              <span className="text-[10px] sm:text-xs font-bold text-sagedark border-b border-sagedark px-1 whitespace-nowrap">
                {s.title}
              </span>
            )}
            {idx < stepsMeta.length - 1 && <span className="text-lightgray text-[9px] md:text-xs font-bold">→</span>}
          </div>
        ))}
      </div>

      {/* Main Mentor Interface */}
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 space-y-4">
          <div className="rounded-2xl bg-sagelight/15 border-2 border-sagelight/35 p-5 relative">
            <div className="flex items-center gap-3">
              <span className="text-3.5xl select-none">🌿</span>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-sagedark uppercase">
                  Mentor Insight
                </span>
                <h4 className="font-serif font-bold text-charcoal">Your Cookbook Mentor</h4>
              </div>
            </div>

            <p className="mt-4 text-xs md:text-sm text-charcoal/80 leading-relaxed italic">
              {currentStep === 0 && (
                "\"Welcome! Every celebrated cookbook starts as a heartbeat. It’s born from a personal journey, a backyard garden, or a mission of care. Let's trace yours carefully.\""
              )}
              {currentStep === 1 && (
                "\"Your author identity is the reader's compass. Setting your pen name is the first official marker of this book. Who is authoring this?\""
              )}
              {currentStep === 2 && (
                "\"Niche focuses are strong pillars. What was the absolute spark or wake-up call that made you reimagine food? Your readers want to connect with your why.\""
              )}
              {currentStep === 3 && (
                "\"Who is your ideal champion? Are they struggle-facing cancer caregivers or newly diagnosed alpha-gal allergy moms? Pick your focal readers.\""
              )}
              {currentStep === 4 && (
                "\"Your theme establishes the aesthetic mood. Let's tag the general focus so Module 3 can recommend palettes that echo this look.\""
              )}
              {currentStep === 5 && (
                "\"Let's declare your battle-tested story. What unique experience qualifies you to write these recipes and save readers the guesswork?\""
              )}
              {currentStep === 6 && (
                "\"Sizing bounds KDP and Etsy metrics. Are we aiming for a compact recipe e-kit or a heavy hardcover family book?\""
              )}
              {currentStep === 7 && (
                "\"Naming is highly emotional. If you're blocked, we can have our server-side Assistant generate options specifically customized to your answers!\""
              )}
              {currentStep === 8 && (
                "\"Look at the scope of your work! Your roadmap is fully charted. Download this summary, then let's build your Dietary Badges in Module 2!\""
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 border border-lightgray/55 text-center">
            <span className="text-xs text-midgray">Step Progress</span>
            <div className="h-2 bg-lightgray rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-sagedark transition-all duration-300"
                style={{ width: `${((currentStep + 1) / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-sagedark block mt-2">
              Step {currentStep + 1} of {TOTAL_STEPS} ({Math.round(((currentStep + 1) / TOTAL_STEPS) * 100)}%)
            </span>
          </div>
        </div>

        {/* Wizard Form Panel */}
        <div className="md:col-span-8">
          <div className="rounded-2xl border-2 border-lightgray/60 bg-white p-8 shadow-sm min-h-[420px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <span className="text-xs font-bold tracking-widest text-terracotta uppercase">
                    Question {currentStep + 1} of {TOTAL_STEPS}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-charcoal mt-1">
                    {stepsMeta[currentStep].title}
                  </h3>
                  <p className="text-xs text-midgray mt-1 leading-relaxed">
                    {stepsMeta[currentStep].desc}
                  </p>
                </div>

                {/* STEP 0: Welcome */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div className="border border-sagelight/40 rounded-xl bg-mentor-bg/25 p-5 text-sm leading-relaxed text-charcoal/95 space-y-3">
                      <p>
                        We’re going to walk through 8 targeted stages together. No logins required, and everything you create persists inside your personal browser cache.
                      </p>
                      <p>
                        Our backend artificial intelligence agent can draft book titles, index keywords, and craft visual palettes directly from your notes. 
                      </p>
                      <p className="font-serif italic font-medium text-sagedark">
                        "Your passion is the root. Let’s grow the branches."
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 1: Author Pen Name */}
                {currentStep === 1 && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-sagedark uppercase tracking-wider block">
                      Author Name / Pen Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border-2 border-lightgray focus:border-sage bg-[#FAF7F2]/50 text-charcoal outline-none transition-all placeholder:text-midgray/40"
                      placeholder="e.g. Robin L. Bates, or RLB Designs Press..."
                      value={state.authorName}
                      onChange={(e) => updateState({ authorName: e.target.value })}
                    />
                    <span className="text-[10px] text-midgray leading-normal block">
                      This will automatically water-stamp your custom recipe cards, licensing, and marketing summaries.
                    </span>
                  </div>
                )}

                {/* STEP 2: Mission & Spark */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-sagedark uppercase tracking-wider block">
                      Identify Your Lead Motivation Spark
                    </label>
                    <div className="grid gap-2 text-xs">
                      {motivationsOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => updateState({ motivation: opt })}
                          className={`w-full text-left px-4 py-2.5 rounded-lg border font-medium transition-all ${
                            state.motivation === opt
                              ? "bg-sagedark border-sagedark text-white shadow-sm"
                              : "bg-white border-lightgray text-charcoal hover:bg-[#EEF5EF] hover:border-sage"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="text-xs font-bold text-sagedark uppercase tracking-wider block mb-1">
                        Describe Your Mission in Your Own Words
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border-2 border-lightgray focus:border-sage bg-[#FAF7F2]/50 text-charcoal outline-none transition-all placeholder:text-midgray/40"
                        placeholder="I want to show mothers of newly-diagnosed children that allergy cooking is still rich, robust, and full of country baking wisdom..."
                        value={state.motivationText}
                        onChange={(e) => updateState({ motivationText: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Ideal Reader */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-sagedark uppercase tracking-wider block">
                      Target Readers (Select Multiple)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {audienceOptions.map((opt) => {
                        const isSel = state.audience.includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              const nextAud = isSel
                                ? state.audience.filter((a) => a !== opt)
                                : [...state.audience, opt];
                              updateState({ audience: nextAud });
                            }}
                            className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                              isSel
                                ? "bg-sagedark border-sagedark text-white"
                                : "bg-cream border-lightgray text-charcoal hover:bg-sagelight/15"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <label className="text-xs font-bold text-sagedark uppercase tracking-wider block mb-1">
                        Any specific subscriber constraints? (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-lightgray focus:border-sage bg-[#FAF7F2]/50 text-charcoal outline-none transition-all"
                        placeholder="Mothers of young children ages 2-10 facing Alpha-gal syndromes"
                        value={state.audienceText}
                        onChange={(e) => updateState({ audienceText: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: Core Theme */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-sagedark uppercase tracking-wider block">
                      Focal Cookbook Themes (Select Multiple)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {themeOptions.map((opt) => {
                        const isSel = state.themes.includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              const nextThemes = isSel
                                ? state.themes.filter((a) => a !== opt)
                                : [...state.themes, opt];
                              updateState({ themes: nextThemes });
                            }}
                            className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                              isSel
                                ? "bg-sagedark border-sagedark text-white"
                                : "bg-cream border-lightgray text-charcoal hover:bg-sagelight/15"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <label className="text-xs font-bold text-sagedark uppercase tracking-wider block mb-1">
                        One Sentence Summary of Your Sub-Genre
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2.5 rounded-lg border-2 border-lightgray focus:border-sage bg-[#FAF7F2]/50 text-charcoal outline-none transition-all"
                        placeholder="E.g. Wholesome organic fall comfort stews and country broths safe from lone star tick reactions."
                        value={state.themeText}
                        onChange={(e) => updateState({ themeText: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 5: Story & Angle */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-sagedark uppercase tracking-wider block">
                      Qualifying Angle Elements (Select Multiple)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {anglesOptions.map((opt) => {
                        const isSel = state.angles.includes(opt);
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              const nextAngles = isSel
                                ? state.angles.filter((a) => a !== opt)
                                : [...state.angles, opt];
                              updateState({ angles: nextAngles });
                            }}
                            className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${
                              isSel
                                ? "bg-terracotta border-terracotta text-white"
                                : "bg-cream border-lightgray text-charcoal hover:bg-terracottalight/20"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2">
                      <label className="text-xs font-bold text-[#8B4A2E] uppercase tracking-wider block mb-1">
                        Describe Your Story or Personal Survival Angle
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border-2 border-lightgray focus:border-sage bg-[#FAF7F2]/50 text-charcoal outline-none transition-all"
                        placeholder="Diagnosed in 2021, I fought back or helped chemotherapy patients find organic clean recipes that soothe nausea and keep energy high..."
                        value={state.angleText}
                        onChange={(e) => updateState({ angleText: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 6: Scale & Formats */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-sagedark uppercase tracking-wider block mb-1.5">
                        Planned Book Scale
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {["Mini (15-30 Recipes)", "Standard (50-75 Recipes)", "Full (100+ Recipes)"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updateState({ scale: opt })}
                            className={`px-3 py-2.5 rounded-lg border font-bold text-center transition-all ${
                              state.scale === opt
                                ? "bg-sagedark border-sagedark text-white"
                                : "bg-white border-lightgray text-charcoal hover:bg-sagelight/10"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="text-xs font-bold text-sagedark uppercase tracking-wider block mb-1.5">
                        Publishing Mediums (Select Multiple)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Print layout (KDP / Ingram Spark)", "E-Book PDF Download", "Etsy Customizable Template", "Spiral Bound Gift Edition"].map((opt) => {
                          const isSel = state.formats.includes(opt);
                          return (
                            <button
                              key={opt}
                              onClick={() => {
                                const nextFor = isSel
                                  ? state.formats.filter((f) => f !== opt)
                                  : [...state.formats, opt];
                                updateState({ formats: nextFor });
                              }}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                                isSel
                                  ? "bg-terracotta border-terracotta text-white"
                                  : "bg-cream border-lightgray text-charcoal hover:bg-terracottalight/15"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: Titles + AI Assistant */}
                {currentStep === 7 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-sagedark uppercase tracking-wider block">
                        Cookbook Working Title
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border-2 border-lightgray focus:border-sage bg-[#FAF7F2]/50 text-charcoal outline-none transition-all placeholder:text-midgray/40"
                        placeholder="e.g. The Alpha-Gal Kitchen: Wholesome Country Cooking..."
                        value={state.title}
                        onChange={(e) => updateState({ title: e.target.value })}
                      />
                      <span className="text-[10px] text-midgray block leading-relaxed">
                        Type your chosen title or click one of the artificial intelligence ideas generated below to load it automatically.
                      </span>
                    </div>

                    {/* AI Generator Integration */}
                    <div className="rounded-xl bg-goldlight/30 border border-gold/40 p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-gold animate-bounce" />
                        <h4 className="font-serif font-bold text-charcoal text-sm">Server-Side Title Planner</h4>
                      </div>
                      <p className="text-xs text-midgray">
                        Sends your author profile, motivation, themes, and personal survival stories anonymously to our private model to return 4 highly emotional and specific cookbook titles with subtitle hooks!
                      </p>

                      <button
                        onClick={handleGenerateTitles}
                        disabled={isGeneratingTitles}
                        className="flex items-center gap-2 rounded-lg bg-gold hover:bg-[#a8872e] text-white px-4 py-2 text-xs font-bold shadow transition-all disabled:opacity-50"
                      >
                        {isGeneratingTitles ? (
                          <>
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                            Drafting Options...
                          </>
                        ) : (
                          "✨ Generate 4 custom title suggestions"
                        )}
                      </button>

                      {aiError && <p className="text-xs text-red-600 italic font-semibold">{aiError}</p>}

                      {state.aiTitles && state.aiTitles.length > 0 && (
                        <div className="grid gap-2 pt-2 text-xs">
                          {state.aiTitles.map((t, index) => (
                            <button
                              key={index}
                              onClick={() => updateState({ title: `${t.title}: ${t.subtitle}` })}
                              className="text-left bg-white hover:bg-neutral-50 p-3 rounded-lg border border-neutral-200 transition-all group"
                            >
                              <div className="flex items-center justify-between">
                                <strong className="text-sagedark font-bold font-serif group-hover:text-terracotta">
                                  {t.title}
                                </strong>
                                <span className="text-[9px] font-bold bg-neutral-100 text-neutral-500 rounded px-1">
                                  Option {index + 1}
                                </span>
                              </div>
                              <span className="text-midgray block text-[11px] font-medium leading-relaxed mt-0.5">
                                {t.subtitle}
                              </span>
                              <span className="text-[10px] text-neutral-400 block italic leading-relaxed mt-1">
                                Reason: {t.why}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 8: Live Summary */}
                {currentStep === 8 && (
                  <div className="space-y-6">
                    <div className="rounded-xl border-3 border-sagedark bg-warmwhite overflow-hidden shadow-sm">
                      <div className="bg-sagedark p-4 text-white text-center">
                        <h4 className="font-serif text-lg font-bold">
                          {state.title || "Untitled Cookbook Thesis"}
                        </h4>
                        <span className="text-[10px] tracking-widest bg-white/10 px-3 py-1 rounded-full inline-block mt-1 font-bold">
                          CONCEPT ROADMAP — {state.authorName || "Anonymous Author"}
                        </span>
                      </div>

                      <div className="p-5 text-sm divide-y divide-[#E8E4DE]/50">
                        <div className="py-2.5 flex items-start gap-4">
                          <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider min-w-[120px] pt-1">
                            Spark Motivation:
                          </span>
                          <span className="text-charcoal leading-relaxed">
                            {state.motivationText || state.motivation || "TBD"}
                          </span>
                        </div>

                        <div className="py-2.5 flex items-start gap-4">
                          <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider min-w-[120px] pt-1">
                            Target Audience:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {state.audience.map((a) => (
                              <span key={a} className="rounded-full bg-sagelight/20 px-2.5 py-0.5 text-xs text-sagedark font-medium">
                                {a}
                              </span>
                            ))}
                            {state.audienceText && (
                              <span className="rounded-full bg-cream border border-lightgray px-2.5 py-0.5 text-xs text-midgray italic">
                                {state.audienceText}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="py-2.5 flex items-start gap-4">
                          <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider min-w-[120px] pt-1">
                            Core Themes:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {state.themes.map((t) => (
                              <span key={t} className="rounded-full bg-sagedark/10 px-2.5 py-0.5 text-xs text-sagedark font-bold">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="py-2.5 flex items-start gap-4">
                          <span className="text-[10px] font-bold text-[#8B4A2E] uppercase tracking-wider min-w-[120px] pt-1">
                            Personal Angle:
                          </span>
                          <span className="text-charcoal leading-relaxed italic">
                            {state.angleText || (state.angles.length > 0 ? state.angles.join(" | ") : "TBD")}
                          </span>
                        </div>

                        <div className="py-2.5 flex items-start gap-4">
                          <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider min-w-[120px] pt-1">
                            Page Metrics:
                          </span>
                          <span className="text-charcoal font-medium">
                            {state.scale || "Not Specified"} / {state.formats.join(", ") || "No Format Selected"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Niche Analysis Deployment */}
                    <div className="rounded-xl border border-lightgray/60 p-5 bg-neutral-50/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Compass className="h-5 w-5 text-terracotta" />
                          <h4 className="font-serif font-bold text-charcoal text-sm">Strategic Niche Audit</h4>
                        </div>
                        {state.nicheAnalysis && (
                          <div className="flex gap-2">
                            <button
                              onClick={handleCopyNicheText}
                              className="flex items-center gap-1 text-[10px] bg-cream hover:bg-[#EEF5EF] border border-lightgray/80 px-2.5 py-1 rounded-md text-charcoal font-semibold transition-all"
                            >
                              <Copy className="h-3 w-3 text-sagedark" />
                              {copied ? "Copied ✓" : "Copy Text"}
                            </button>
                            <button
                              onClick={() => setIsEditingNiche(!isEditingNiche)}
                              className="flex items-center gap-1 text-[10px] bg-sagedark hover:bg-sage px-2.5 py-1 rounded-md text-white font-semibold transition-all"
                            >
                              <Edit3 className="h-3 w-3" />
                              {isEditingNiche ? "Cancel" : "Edit Audit"}
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-midgray">
                        Sends your finished planning coordinates to Gemini to build a custom positioning report, Amazon Browse categories, KDP keyword strings, and draft limitations to audit!
                      </p>

                      {!isEditingNiche && (
                        <button
                          onClick={handleGetNicheAnalysis}
                          disabled={isAnalyzingNiche}
                          className="flex items-center gap-2 rounded-lg bg-terracotta hover:bg-terracottadark text-white px-4 py-2 text-xs font-bold shadow transition-all disabled:opacity-50"
                        >
                          {isAnalyzingNiche ? (
                            <>
                              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                              Querying Database Gaps...
                            </>
                          ) : (
                            "🎯 Analyze positioning & browse pathways"
                          )}
                        </button>
                      )}

                      {state.nicheAnalysis && (
                        <>
                          {isEditingNiche ? (
                            /* Editing Interface */
                            <div className="space-y-4 bg-white p-4 rounded-xl border border-neutral-200 text-xs">
                              <h5 className="font-bold text-sagedark uppercase tracking-wider text-[10px] border-b border-lightgray pb-1.5 mb-2">
                                Edit Niche Audit Information
                              </h5>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-[10px] font-bold text-charcoal uppercase tracking-wider mb-1">
                                    Primary Niche Positioning
                                  </label>
                                  <textarea
                                    value={editedNiche}
                                    onChange={(e) => setEditedNiche(e.target.value)}
                                    rows={2}
                                    className="w-full text-xs p-2 border border-lightgray rounded-md focus:border-sagedark outline-none"
                                    placeholder="Edit primary niche positioning..."
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-charcoal uppercase tracking-wider mb-1">
                                    Top Amazon Browse Categories (One category per line)
                                  </label>
                                  <textarea
                                    value={editedCategories}
                                    onChange={(e) => setEditedCategories(e.target.value)}
                                    rows={3}
                                    className="w-full text-xs p-2 border border-lightgray rounded-md font-mono focus:border-sagedark outline-none"
                                    placeholder="Edit categories..."
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-charcoal uppercase tracking-wider mb-1">
                                    Auto KDP Search Keywords (Comma separated)
                                  </label>
                                  <input
                                    type="text"
                                    value={editedKeywords}
                                    onChange={(e) => setEditedKeywords(e.target.value)}
                                    className="w-full text-xs p-2 border border-lightgray rounded-md font-mono focus:border-sagedark outline-none"
                                    placeholder="Edit keywords..."
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-charcoal uppercase tracking-wider mb-1">
                                    Concept Strengths (One strength per line)
                                  </label>
                                  <textarea
                                    value={editedStrengths}
                                    onChange={(e) => setEditedStrengths(e.target.value)}
                                    rows={3}
                                    className="w-full text-xs p-2 border border-lightgray rounded-md focus:border-sagedark outline-none"
                                    placeholder="Edit strengths..."
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-charcoal uppercase tracking-wider mb-1">
                                    Audit Considerations (One consideration per line)
                                  </label>
                                  <textarea
                                    value={editedSuggestions}
                                    onChange={(e) => setEditedSuggestions(e.target.value)}
                                    rows={3}
                                    className="w-full text-xs p-2 border border-lightgray rounded-md focus:border-sagedark outline-none"
                                    placeholder="Edit suggestions..."
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2 pt-3 border-t border-lightgray">
                                <button
                                  onClick={handleSaveNicheEdits}
                                  className="flex items-center gap-1.5 px-4 py-2 bg-terracotta hover:bg-terracottadark text-cream rounded-md font-bold transition-all"
                                >
                                  <Save className="h-3.5 w-3.5" />
                                  Save Edits
                                </button>
                                <button
                                  onClick={() => setIsEditingNiche(false)}
                                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-charcoal rounded-md font-bold transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Read-Only Interface */
                            <div className="grid gap-3 pt-2 text-xs">
                              <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
                                <span className="text-[9px] font-bold text-terracottadark block uppercase tracking-wider">
                                  Primary Niche Positioning
                                </span>
                                <p className="text-charcoal leading-relaxed font-semibold mt-1">
                                  {state.nicheAnalysis.primaryNiche}
                                </p>
                              </div>

                              <div className="grid gap-2 sm:grid-cols-2">
                                <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
                                  <span className="text-[9px] font-bold text-sagedark block uppercase tracking-wider">
                                    Top Amazon Browse Categories
                                  </span>
                                  <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-midgray">
                                    {state.nicheAnalysis.amazonCategories.map((cat, idx) => (
                                      <li key={idx}>{cat}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-white p-3.5 rounded-lg border border-neutral-200">
                                  <span className="text-[9px] font-bold text-sagedark block uppercase tracking-wider">
                                    Auto KDP Search Keywords
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {state.nicheAnalysis.keywords.map((kw, idx) => (
                                      <span key={idx} className="rounded bg-neutral-100 text-neutral-600 px-1.5 py-0.5 font-mono text-[9px]">
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-2 sm:grid-cols-2">
                                <div className="bg-neutral-100/50 p-3.5 rounded-lg border border-neutral-200">
                                  <span className="text-[9px] font-bold text-sagedark block uppercase tracking-wider">
                                    Concept Strengths
                                  </span>
                                  <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-[#2C4A2E]">
                                    {state.nicheAnalysis.strengths.map((str, idx) => (
                                      <li key={idx} className="font-medium">{str}</li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-terracottalight/20 p-3.5 rounded-lg border border-neutral-200">
                                  <span className="text-[9px] font-bold text-[#8B4A2E] block uppercase tracking-wider">
                                    Audit Considerations
                                  </span>
                                  <ul className="list-disc pl-4 space-y-1 mt-1 text-[11px] text-terracottadark">
                                    {state.nicheAnalysis.suggestions.map((sug, idx) => (
                                      <li key={idx} className="font-semibold">{sug}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Nav inside Wizard Card */}
            <div className="mt-8 pt-4 border-t border-lightgray/50 flex justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-4 py-2 font-bold text-xs text-midgray hover:text-charcoal disabled:opacity-20 transition-all"
              >
                ← Back
              </button>

              {currentStep < TOTAL_STEPS - 1 ? (
                <button
                  onClick={handleNext}
                  className="rounded-lg bg-sagedark hover:bg-sage text-white px-5 py-2 text-xs font-bold shadow-sm transition-all"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={() => onNavigate(2)}
                  className="rounded-lg bg-terracotta hover:bg-terracottadark text-white px-5 py-2 text-xs font-bold shadow-sm transition-all"
                >
                  Proceed to Module 2 🏷️
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
