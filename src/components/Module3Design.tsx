import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Palette, HelpCircle, Palette as Paintbrush, Copy, Layout, Compass } from "lucide-react";
import { GlobalState, DesignRecommendation } from "../types";
import CoverStudio from "./CoverStudio";

interface Module3Props {
  state: GlobalState;
  updateState: (fields: Partial<GlobalState>) => void;
  onNavigate: (module: number) => void;
}

const STYLES = [
  {
    id: "farmhouse",
    name: "Farmhouse Warmth",
    tagline: "Rustic · Cozy · Honest",
    desc: "Warm creams, aged wood tones, and hand-lettered accents. Feels like a country kitchen loved for generations.",
    swatches: ["#F5ECD7", "#C9A87C", "#7B5E3A", "#4A3728", "#2C1810"],
    headingFont: "Playfair Display",
    bodyFont: "Lato",
    canvaTips: [
      "Use warm beige (#F5ECD7) as your page background",
      "Pair Playfair Display (heading) with Lato (body) — both free",
      "Look for 'kraft paper' textures in free Canva backgrounds",
      "Search 'farmhouse' elements for free dividers & borders"
    ],
    bestFor: ["Garden-to-table", "Family recipes", "Homestead", "Rural life"],
    moodBg: "linear-gradient(135deg, #F5ECD7 0%, #C9A87C 50%, #7B5E3A 100%)",
    textColor: "#2C1810"
  },
  {
    id: "clean-modern",
    name: "Clean & Modern",
    tagline: "Minimal · Airy · Professional",
    desc: "White space does the heavy lifting. Precise modern typography, thin geometric lines, and clean green highlights.",
    swatches: ["#FFFFFF", "#F2F2F0", "#CCCCCC", "#2C2C2C", "#1A6B4A"],
    headingFont: "Oswald",
    bodyFont: "Lato",
    canvaTips: [
      "Use pure white backgrounds with a single accent color",
      "Oswald (free) for bold uppercase headings",
      "Thin horizontal lines between sections",
      "Keep images square or 4:3 using free frame frames"
    ],
    bestFor: ["Keto", "Paleo", "Whole30", "Health & Wellness"],
    moodBg: "linear-gradient(135deg, #F2F2F0 0%, #CCCCCC 50%, #1A6B4A 100%)",
    textColor: "#1A1A1A"
  },
  {
    id: "earthy-botanical",
    name: "Earthy Botanical",
    tagline: "Natural · Grounded · Healing",
    desc: "Deep greens, terracotta, and botanical illustration accents. Speaks of walks through wild garden herb gardens.",
    swatches: ["#EFF5EC", "#7A9E7E", "#4A6B4E", "#C4714A", "#2C3E28"],
    headingFont: "Playfair Display",
    bodyFont: "Lato",
    canvaTips: [
      "Search 'botanical' or 'leaf' in free elements",
      "Use sage green (#4A6B4E) as your primary brand accent",
      "Layer subtle leaf sketches behind title blocks",
      "Rounded corner frames work beautifully on food photos"
    ],
    bestFor: ["AGS Safe", "Cancer safety", "Organic recipes", "Vegan"],
    moodBg: "linear-gradient(135deg, #EFF5EC 0%, #7A9E7E 50%, #2C3E28 100%)",
    textColor: "#2C3E28"
  },
  {
    id: "healing-green",
    name: "Healing & Wholesome",
    tagline: "Gentle · Nurturing · Trusted",
    desc: "Soft medical-grade greens and warm whites with gentle typography. Communicates clinical safety, care, and family trust.",
    swatches: ["#F4FAF5", "#A8D5AE", "#5B9E63", "#3A6B40", "#F0EAD6"],
    headingFont: "Inter",
    bodyFont: "Inter",
    canvaTips: [
      "Keep layouts pristine and spacious — healing needs room to breathe",
      "Soft green (#A8D5AE) for badge headers and card backgrounds",
      "Use Inter throughout — highly readable, logical, and calm",
      "Heart-shaped vector separators from free elements"
    ],
    bestFor: ["Cancer recovery", "Oncology support", "Allergies", "Low-Sodium"],
    moodBg: "linear-gradient(135deg, #F4FAF5 0%, #A8D5AE 50%, #3A6B40 100%)",
    textColor: "#1A3A1E"
  }
];

const COVERS = [
  { name: "Full Bleed Photo", bg: "linear-gradient(160deg,#2C3E28,#7A9E7E)", icon: "📸", desc: "One stunning hero image fills the canvas edge-to-edge. Typography is overlaid elegantly." },
  { name: "Earthy Flat Lay Grid", bg: "linear-gradient(160deg,#FAF7F2,#C9A87C)", icon: "⬜", desc: "Overhead shots of vegetables or styled dishes in a clean, grid block layout." },
  { name: "Split Panel Accent", bg: "linear-gradient(160deg,#4A6B4E,#C4714A)", icon: "◧", desc: "Visual photo on one side, clean brand block with title on the other. High contrast." }
];

export default function Module3Design({ state, updateState, onNavigate }: Module3Props) {
  const [activeTab, setActiveTab] = useState<"library" | "recommender" | "cover-studio">("library");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorErrorMsg] = useState("");

  const handleSelectStyle = (id: string) => {
    updateState({ selectedStyleId: id });
  };

  const handleGetRecommendation = async () => {
    setIsGenerating(true);
    setErrorErrorMsg("");
    try {
      const summary = `Title: ${state.title}. Motivation: ${state.motivationText || state.motivation}. Themes: ${state.themes.join(", ")}. Angles: ${state.angleText || state.angles.join(", ")}`;
      const response = await fetch("/api/ai/design-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: summary })
      });
      if (!response.ok) throw new Error("Vite backend failed to generate style recommendation");
      const data: DesignRecommendation = await response.json();
      updateState({ aiDesignRecommendation: data });
    } catch (err: any) {
      setErrorErrorMsg(err.message || "Failed to reach server-side designer. Try library directions!");
    } finally {
      setIsGenerating(false);
    }
  };

  const activeStyle = STYLES.find((s) => s.id === state.selectedStyleId);

  return (
    <div className="space-y-8">
      {/* Sub Tabs */}
      <div className="flex bg-white rounded-xl border border-lightgray/55 p-1 max-w-xl mx-auto shadow-sm">
        <button
          onClick={() => setActiveTab("library")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "library" ? "bg-sagedark text-white shadow-sm" : "text-midgray hover:text-charcoal"
          }`}
        >
          <Paintbrush className="h-4 w-4" /> Editorial Presets
        </button>
        <button
          onClick={() => setActiveTab("cover-studio")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "cover-studio" ? "bg-terracotta text-white shadow-sm" : "text-midgray hover:text-charcoal"
          }`}
        >
          <Layout className="h-4 w-4" /> 🎨 Cover Art Studio
        </button>
        <button
          onClick={() => setActiveTab("recommender")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "recommender" ? "bg-gold text-white shadow-sm" : "text-midgray hover:text-charcoal"
          }`}
        >
          <Sparkles className="h-4 w-4" /> AI Customized Style
        </button>
      </div>

      {/* Selected Style Indicator Banner */}
      {activeStyle && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border-2 border-sagedark bg-warmwhite p-5 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
              Active Design Selected
            </span>
            <h4 className="font-serif text-lg font-bold text-charcoal">
              {activeStyle.name} — {activeStyle.tagline}
            </h4>
            <span className="text-xs text-midgray block leading-relaxed">
              Fonts: <strong>{activeStyle.headingFont}</strong> (Heads) &amp; <strong>{activeStyle.bodyFont}</strong> (Body COPY).
            </span>
          </div>

          <div className="flex gap-1.5 bg-cream/70 border border-lightgray/50 rounded-lg p-2">
            {activeStyle.swatches.map((c) => (
              <div
                key={c}
                style={{ backgroundColor: c }}
                className="h-8 w-8 rounded-full border border-black/10 flex items-center justify-center text-[10px] font-mono select-all text-white font-bold tracking-tight shadow-sm"
                title={`Click to copy hex ${c}`}
                onClick={() => navigator.clipboard.writeText(c)}
              >
                {/* Visual swatches */}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tab Panels */}
      {activeTab === "library" && (
        <div className="space-y-10">
          <section className="space-y-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-charcoal">Pre-Built Brand Presets</h3>
              <p className="text-xs text-midgray mt-0.5">
                Carefully styled palettes built to capture the emotional intent of therapeutic, specialty, and farm cooking.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {STYLES.map((s) => {
                const isSelected = state.selectedStyleId === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectStyle(s.id)}
                    className={`rounded-2xl border-2 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer ${
                      isSelected ? "border-sagedark ring-2 ring-sagedark/20" : "border-lightgray/60"
                    }`}
                  >
                    <div className="h-28 relative overflow-hidden" style={{ background: s.moodBg }}>
                      <div className="absolute inset-0 bg-[#2C2C2C]/5" />
                      <div className="absolute bottom-4 left-5 text-white">
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase font-bold tracking-widest text-[#FAF7F2]">
                          {s.tagline}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-cream mt-0.5 drop-shadow-sm">
                          {s.name}
                        </h4>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <p className="text-xs text-midgray leading-relaxed">{s.desc}</p>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#FAF7F2] p-2.5 rounded-lg">
                          <span className="text-[9px] font-bold text-sagedark block uppercase tracking-wider mb-2">
                            Palette Hexes
                          </span>
                          <div className="flex gap-1">
                            {s.swatches.map((hex) => (
                              <div
                                key={hex}
                                style={{ backgroundColor: hex }}
                                className="h-5 w-5 rounded-full border border-black/10"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#FAF7F2] p-2.5 rounded-lg">
                          <span className="text-[9px] font-bold text-sagedark block uppercase tracking-wider">
                            Typography pairing
                          </span>
                          <span className="font-bold text-[11px] block text-charcoal mt-1 truncate">
                            {s.headingFont} / {s.bodyFont}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-lg bg-goldlight/25 border border-gold/40 p-3 text-[11px] leading-relaxed text-charcoal">
                        <span className="font-bold block text-gold text-[9px] uppercase tracking-wider mb-1">
                          📐 Canva Workspace Directives
                        </span>
                        <ul className="list-disc pl-4 space-y-1">
                          {s.canvaTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>

                      <button
                        className={`w-full rounded-lg py-2 text-xs font-bold text-center transition-all ${
                          isSelected
                            ? "bg-sagedark text-white"
                            : "border-2 border-sagedark text-sagedark bg-white hover:bg-sagelight/15"
                        }`}
                      >
                        {isSelected ? "Style Active ✓" : "Activate Theme"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Cover Blueprints */}
          <section className="space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">Cover Blueprint Ideas</h3>
              <p className="text-xs text-midgray mt-0.5">
                Your cover serves as your primary retail blurb. These designs work beautifully with Canva's free frame grids.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {COVERS.map((c) => (
                <div key={c.name} className="bg-white rounded-xl border border-lightgray/55 p-4 space-y-3">
                  <div
                    className="h-28 rounded-lg flex items-center justify-center text-3xl select-none"
                    style={{ background: c.bg }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-charcoal">{c.name}</h4>
                    <p className="text-[11px] text-midgray leading-relaxed mt-1">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === "cover-studio" && (
        <CoverStudio state={state} updateState={updateState} />
      )}

      {activeTab === "recommender" && (
        /* Recommender Tab calling backend server proxy */
        <div className="rounded-2xl border-2 border-goldlight bg-white p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-charcoal">
              AI-Generated Art Direction
            </h3>
            <p className="text-xs text-midgray leading-relaxed">
              Based on your planning thesis (Cookbook Title, Author notes, Niche profile, Motivations), Gemini will construct a fully customized visual direction, complete with palette recommendations, Google Font combinations, specific search vectors, and element styling guides.
            </p>
          </div>

          <div className="border border-sagelight/40 rounded-xl bg-mentor-bg/25 p-4 text-xs leading-relaxed text-charcoal/90">
            📊 <strong>Active Context Profile:</strong> Your Title (<strong>{state.title || "TBD"}</strong>), Motivation (<strong>{state.motivation || "TBD"}</strong>), and Story notes will be compiled to build the design brief.
          </div>

          <button
            onClick={handleGetRecommendation}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-gold hover:bg-[#a8872e] text-white px-5 py-2.5 text-xs font-bold shadow-md transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                Drafting Brand Board...
              </>
            ) : (
              "✨ Generate customized art direction report"
            )}
          </button>

          {errorMsg && <p className="text-xs text-red-600 font-semibold italic">{errorMsg}</p>}

          {state.aiDesignRecommendation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-2 border-gold rounded-xl p-5 space-y-6 bg-white"
            >
              <div>
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">
                  AI Brand Board
                </span>
                <h4 className="font-serif text-xl font-bold text-charcoal mt-0.5">
                  {state.aiDesignRecommendation.styleName} — {state.aiDesignRecommendation.styleTagline}
                </h4>
                <p className="text-xs text-midgray italic mt-1 leading-relaxed">
                  {state.aiDesignRecommendation.reasoning}
                </p>
              </div>

              {/* Palette Card */}
              <div className="grid gap-4 sm:grid-cols-5 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                {state.aiDesignRecommendation.palette.map((p, idx) => (
                  <div key={idx} className="text-center space-y-1">
                    <div
                      style={{ backgroundColor: p.hex }}
                      className="h-10 w-10 mx-auto rounded-full border border-black/10 shadow-sm"
                    />
                    <strong className="block text-xs font-mono text-charcoal">{p.hex}</strong>
                    <span className="text-[9px] text-midgray block leading-tight truncate px-1" title={p.use}>
                      {p.use}
                    </span>
                  </div>
                ))}
              </div>

              {/* Specifications grid */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="bg-[#FAF7F2] p-4 rounded-lg space-y-2">
                  <span className="text-[9px] font-bold text-[#8B4A2E] block uppercase tracking-wider">
                    Font Recommendations
                  </span>
                  <p className="text-charcoal leading-relaxed font-bold">
                    Title: {state.aiDesignRecommendation.headingFont} <br />
                    Body Copy: {state.aiDesignRecommendation.bodyFont}
                  </p>
                  <p className="text-midgray leading-relaxed text-[11px] italic">
                    Reason: {state.aiDesignRecommendation.fontReasoning}
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-lg space-y-2">
                  <span className="text-[9px] font-bold text-sagedark block uppercase tracking-wider">
                    Ideal Cover Blueprint
                  </span>
                  <p className="text-charcoal leading-relaxed text-[11px]">
                    {state.aiDesignRecommendation.coverConcept}
                  </p>
                </div>
              </div>

              {/* Elements & Tips */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="bg-neutral-50 p-4 rounded-lg space-y-2">
                  <span className="text-[9px] font-bold text-sagedark block uppercase tracking-wider">
                    Actionable Canva Brand Tips
                  </span>
                  <ul className="list-disc pl-4 space-y-1 leading-relaxed text-midgray">
                    {state.aiDesignRecommendation.canvaTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg space-y-2">
                  <span className="text-[9px] font-bold text-sagedark block uppercase tracking-wider">
                    Search Vectors for Canva Free Panel
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {state.aiDesignRecommendation.elementsToSearch.map((el, idx) => (
                      <span key={idx} className="rounded-full bg-cream border border-lightgray px-2.5 py-0.5 font-mono text-[9px] text-[#2C2C2C]">
                        "{el}"
                      </span>
                    ))}
                  </div>

                  <div className="pt-2">
                    <span className="text-[8px] font-bold text-midgray block uppercase tracking-wider">
                      Target Aesthetics
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {state.aiDesignRecommendation.moodWords.map((word, idx) => (
                        <span key={idx} className="rounded bg-sagelight/20 px-2.5 py-0.5 font-bold text-[9px] text-sagedark">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Complete Step Navigation */}
      <div className="pt-6 border-t border-lightgray/40 flex justify-between">
        <button
          onClick={() => onNavigate(2)}
          className="rounded-lg border-2 border-lightgray hover:border-charcoal bg-white text-midgray hover:text-charcoal px-4 py-2 text-xs font-bold transition-all"
        >
          ← Back to Dietary Badge setup
        </button>
        <button
          onClick={() => onNavigate(4)}
          className="rounded-lg bg-terracotta hover:bg-terracottadark text-white px-5 py-2.5 text-xs font-bold shadow-sm transition-all"
        >
          Proceed to Canva Guide ✏️
        </button>
      </div>
    </div>
  );
}
