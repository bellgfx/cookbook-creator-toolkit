import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Layout, Printer, Save, CheckCircle, ChevronDown, Check } from "lucide-react";
import { GlobalState } from "../types";

interface Module4Props {
  state: GlobalState;
  updateState: (fields: Partial<GlobalState>) => void;
  onNavigate: (module: number) => void;
}

export default function Module4Canva({ state, updateState, onNavigate }: Module4Props) {
  const [activeTab, setActiveTab] = useState<"tutorial" | "specs" | "checklist">("tutorial");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ kdp: true });

  const checklistItems = [
    // Content Index
    { id: 0, text: "All recipe titles are finalized and spelled correctly", category: "Manuscript" },
    { id: 1, text: "All ingredient lists and allergy warning lines match", category: "Manuscript" },
    { id: 2, text: "Instructions are sequenced in the correct numbered order", category: "Manuscript" },
    { id: 3, text: "Table of Contents page links correspond correctly to recipes", category: "Manuscript" },
    
    // Layout Layout
    { id: 4, text: "Color hex values are consistent across all brand blocks", category: "Visuals" },
    { id: 5, text: "Limit to max 2 font families (one header, one body COPY)", category: "Visuals" },
    { id: 6, text: "All placeholder text elements have been cleanly replaced", category: "Visuals" },
    { id: 7, text: "Page numbers are clearly added on all interior sheets", category: "Visuals" },

    // Photo Assets
    { id: 8, text: "All hero food graphics are high resolution (300 DPI)", category: "Assets" },
    { id: 9, text: "No watermarked 'Pro' elements exist if using a free tier", category: "Assets" },
    { id: 10, text: "Images sit cleanly within Canva frame shapes without stretch", category: "Assets" },

    // Print Prep
    { id: 11, text: "PDF interior is exported utilizing the 'PDF Print' setting", category: "Export" },
    { id: 12, text: "Spine dimensions correspond with KDP paper requirements", category: "Export" },
    { id: 13, text: "Margins conform to the KDP gutter safety limits", category: "Export" },
  ];

  const toggleAccordion = (key: string) => {
    setOpenAccordions({ ...openAccordions, [key]: !openAccordions[key] });
  };

  const handleToggleCheck = (id: number) => {
    const nextCheckList = { ...state.canvaChecklistState, [id]: !state.canvaChecklistState[id] };
    updateState({ canvaChecklistState: nextCheckList });
  };

  const totalChecked = Object.values(state.canvaChecklistState).filter(Boolean).length;
  const progressPercent = Math.round((totalChecked / checklistItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex bg-white rounded-xl border border-lightgray/55 p-1 max-w-sm mx-auto shadow-sm">
        <button
          onClick={() => setActiveTab("tutorial")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "tutorial" ? "bg-sagedark text-white shadow-sm" : "text-midgray hover:text-charcoal"
          }`}
        >
          🚀 Getting Started
        </button>
        <button
          onClick={() => setActiveTab("specs")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "specs" ? "bg-sagedark text-white shadow-sm" : "text-midgray hover:text-charcoal"
          }`}
        >
          📐 Dimensions & Specs
        </button>
        <button
          onClick={() => setActiveTab("checklist")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "checklist" ? "bg-sagedark text-white shadow-sm" : "text-midgray hover:text-charcoal"
          }`}
        >
          ✅ Prep Checklist
        </button>
      </div>

      {activeTab === "tutorial" && (
        <div className="space-y-6">
          {/* Main Directions */}
          <div className="bg-white p-6 rounded-2xl border border-lightgray/60 space-y-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">Design Workspace Setup</h3>
              <p className="text-xs text-midgray mt-0.5">
                Ensure perfect alignment inside Canva free tiers without expensive subscriptions.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Click 'Use Template'",
                  desc: "Always duplicate the original file link to spawn a clean working copy. Editing directly in parent links risks loss of drafts. Label your file clearly: 'YOUR_TITLE_Interior_Working_v1'."
                },
                {
                  step: 2,
                  title: "Save Your Brand Board Presets",
                  desc: "Click any background swatch. Type your chosen hex code (e.g. Earthy Sage or Wholesome Gold). Canva preserves active colors under 'Document Colors' for rapid access."
                },
                {
                  step: 3,
                  title: "Setup Free Frame Grids",
                  desc: "Search 'Frames' in the left element panel. Filter down to free options. These keep your food photography square or 4:3 perfectly aligned without ugly stretch profiles."
                },
                {
                  step: 4,
                  title: "Maintain Copy-Paste Consistency",
                  desc: "Create one flawless template recipe page. When writing new chapters, duplicate that page, then swap out the titles and text fields only. This guarantees crisp, professional rhythm throughout the book."
                }
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sagedark text-white text-xs font-bold flex-shrink-0 mt-1">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-charcoal">{s.title}</h4>
                    <p className="text-xs text-midgray mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips block below */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-goldlight/25 border border-gold/40 p-5 space-y-3">
              <span className="text-[10px] font-bold text-terracottadark uppercase tracking-wider block">
                Free-Tier Hack
              </span>
              <p className="text-xs text-charcoal leading-relaxed">
                Background removals are Pro-specific. Work around this: use free sites like <strong>remove.bg</strong> to delete backgrounds first, then upload the PNG to Canva!
              </p>
            </div>

            <div className="rounded-2xl bg-[#EFF5EC] border border-sagelight/40 p-5 space-y-3">
              <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                Page Margins Check
              </span>
              <p className="text-xs text-charcoal/80 leading-relaxed">
                Always enable 'Show Rulers and Guides' and 'Show Print Bleed' inside the Canva File menu. This avoids critical rejection inside KDP or Ingram Spark later on!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "specs" && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border border-lightgray/60 p-6 space-y-5">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">Platform Dimension Specifications</h3>
              <p className="text-xs text-midgray mt-0.5">
                Exact measurements matching KDP, Ingram Spark, and Etsy standard print sizes.
              </p>
            </div>

            <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FAF7F2] border-b border-neutral-200">
                  <tr className="text-sagedark text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-3">Platform Target</th>
                    <th className="p-3">Recommended Trim Size</th>
                    <th className="p-3">Bleed Configuration</th>
                    <th className="p-3">Gutter Margin Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="p-3 font-bold">Amazon KDP (Interior)</td>
                    <td className="p-3">8.5" × 11" (or 6" × 9")</td>
                    <td className="p-3 font-semibold text-terracotta">None - Keep all drawings inside margins</td>
                    <td className="p-3">0.375" minimum (0.75" inside gutter)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">Ingram Spark (Distributors)</td>
                    <td className="p-3">8.5" × 11" </td>
                    <td className="p-3 font-semibold text-sagedark">0.125" bleed required</td>
                    <td className="p-3">0.5" secure grid buffer</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold">Etsy Digital Standard PDF</td>
                    <td className="p-3">8.5" × 11" / A4</td>
                    <td className="p-3">None required (optimized for home print)</td>
                    <td className="p-3">0.25" general boundaries</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Accordion FAQ items */}
            <div className="space-y-2 pt-2">
              <div className="border border-neutral-200 rounded-lg overflow-hidden text-xs">
                <button
                  onClick={() => toggleAccordion("kdp")}
                  className="w-full text-left p-3.5 bg-neutral-50/50 flex justify-between items-center font-bold text-charcoal font-serif"
                >
                  <span>How to calculate spine width on KDP covers?</span>
                  <ChevronDown className={`h-4 w-4 text-midgray transform transition-transform ${openAccordions.kdp ? "rotate-180" : ""}`} />
                </button>
                {openAccordions.kdp && (
                  <div className="p-4 border-t border-neutral-200 bg-white leading-relaxed text-midgray">
                    Spines map exactly to page count! Multiply: Black or White inside page count × 0.00225" (or color inside page count × 0.00235") to determine precise spine center margins. Download templates directly from kdp.amazon.com cover calculator.
                  </div>
                )}
              </div>

              <div className="border border-neutral-200 rounded-lg overflow-hidden text-xs">
                <button
                  onClick={() => toggleAccordion("ingram")}
                  className="w-full text-left p-3.5 bg-neutral-50/50 flex justify-between items-center font-bold text-charcoal font-serif"
                >
                  <span>Format differences between PDF Standard and PDF Print?</span>
                  <ChevronDown className={`h-4 w-4 text-midgray transform transition-transform ${openAccordions.ingram ? "rotate-180" : ""}`} />
                </button>
                {openAccordions.ingram && (
                  <div className="p-4 border-t border-neutral-200 bg-white leading-relaxed text-midgray">
                    <strong>PDF Standard:</strong> Lowers output size (~96 DPI) with web-safe configurations. Perfect for Etsy digital products. <br />
                    <strong>PDF Print:</strong> Saves image resolutions up to 300 DPI, embeds true fonts, and converts color paths cleanly for self-publishing printers.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "checklist" && (
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-lightgray/60">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-lightgray/40 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">Pre-Export Audit Checklist</h3>
              <p className="text-xs text-midgray mt-0.5">
                Run through this diagnostic sequence before compiling your finalized book.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-cream px-4 py-2 rounded-xl border border-lightgray/40">
              <span className="text-xs font-bold text-sagedark">{totalChecked} of {checklistItems.length} audited</span>
              <div className="h-2 w-28 bg-lightgray rounded-full overflow-hidden">
                <div
                  className="h-full bg-sagedark transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-serif italic text-sagedark font-bold">{progressPercent}%</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            {checklistItems.map((item) => {
              const checked = state.canvaChecklistState[item.id] || false;
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleCheck(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    checked
                      ? "bg-mentor-bg/30 border-sage/60 text-midgray"
                      : "bg-[#FAF7F2]/40 border-lightgray text-charcoal hover:border-sage"
                  }`}
                >
                  <div className={`p-0.5 rounded border-2 flex items-center justify-center mt-0.5 ${
                    checked ? "bg-sagedark border-sagedark text-white" : "border-neutral-300"
                  }`}>
                    {checked && <Check className="h-3 w-3" />}
                  </div>
                  <div>
                    <p className={`font-semibold ${checked ? "line-through text-midgray/70" : ""}`}>{item.text}</p>
                    <span className="text-[9px] bg-neutral-100 text-neutral-500 rounded px-1.5 py-0.5 inline-block mt-1 uppercase font-bold tracking-wide">
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete Step Navigation */}
      <div className="pt-6 border-t border-lightgray/40 flex justify-between">
        <button
          onClick={() => onNavigate(3)}
          className="rounded-lg border-2 border-lightgray hover:border-charcoal bg-white text-midgray hover:text-charcoal px-4 py-2 text-xs font-bold transition-all"
        >
          ← Back to Design Options
        </button>
        <button
          onClick={() => onNavigate(5)}
          className="rounded-lg bg-terracotta hover:bg-terracottadark text-white px-5 py-2.5 text-xs font-bold shadow-sm transition-all"
        >
          Proceed to Recipe Builder 📋
        </button>
      </div>
    </div>
  );
}
