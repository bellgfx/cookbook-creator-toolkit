import { useState } from "react";
import { motion } from "motion/react";
import { Tag, ArrowUp, ArrowDown, ChevronRight, Award, Trash2 } from "lucide-react";
import { GlobalState } from "../types";

interface Module2Props {
  state: GlobalState;
  updateState: (fields: Partial<GlobalState>) => void;
  onNavigate: (module: number) => void;
}

export default function Module2Dietary({ state, updateState, onNavigate }: Module2Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [customInput, setCustomInput] = useState("");

  const TOTAL_STEPS = 4;

  const primaryBadgeOptions = [
    { label: "⚠️ Alpha-Gal Safe (Mammal-Free & Dairy-Free)", type: "ags" },
    { label: "🌱 Vegan", type: "standard" },
    { label: "🥦 Vegetarian", type: "standard" },
    { label: "🌾 Gluten-Free", type: "standard" },
    { label: "🥛 Dairy-Free", type: "standard" },
    { label: "🩺 Diabetic & Low-Glycemic", type: "standard" },
    { label: "🧠 Gut-Health & Low-FODMAP", type: "standard" },
    { label: "💚 Cancer Recovery", type: "cancer" },
    { label: "🥑 Ketogenic", type: "standard" },
    { label: "🦕 Paleo", type: "standard" },
    { label: "🩹 Autoimmune & AIP", type: "cancer" },
    { label: "🫁 Heart & Cardiovascular", type: "standard" }
  ];

  const secondaryBadgeOptions = [
    // AGS & Autoimmune / Medical
    { label: "🚫 Mammal-Free", type: "ags" },
    { label: "🧬 Migraine & Neurological", type: "ags" },
    { label: "🩸 Blood Sugar Management", type: "standard" },
    { label: "🫀 Heart & Cardiovascular", type: "standard" },
    { label: "🩹 Inflammation & AIP (POTS, RA, Crohn's)", type: "cancer" },
    { label: "🧼 Gastrointestinal (IBS, IBD, FODMAP)", type: "standard" },
    { label: "🧹 Liver Health (FLD, MASLD, Hepatitis)", type: "cancer" },
    { label: "🧪 Renal Diet (Kidney Support)", type: "cancer" },
    { label: "🥄 Soft / Pureed Diet", type: "standard" },
    
    // Lifestyle & Portion & Weight
    { label: "🥩 Flexitarian", type: "standard" },
    { label: "📉 Low-Carb", type: "standard" },
    { label: "🧊 Carb-Free", type: "standard" },
    { label: "💪 High-Protein", type: "standard" },
    { label: "⚖️ Weight Loss Diet", type: "style" },
    { label: "📈 Weight Gain Development", type: "style" },
    { label: "🎭 Fad Diets Support", type: "style" },

    // Allergies & Specifics
    { label: "🥜 Nut-Free (Food Allergies)", type: "standard" },
    { label: "🥚 Egg-Free", type: "standard" },
    { label: "🌿 Soy-Free", type: "standard" },
    { label: "🌶️ Nightshade-Free", type: "standard" },
    { label: "🌽 Corn-Free", type: "standard" },
    { label: "🧂 Low-Sodium / Salt-Free", type: "standard" },
    { label: "🍬 Low-Sugar / Sugar-Free", type: "standard" },
    
    // Other Known Diets
    { label: "🌊 Mediterranean", type: "standard" },
    { label: "🥗 Raw Food Diet", type: "standard" },
    { label: "🏛️ DASH Diet", type: "standard" },
    { label: "☪️ Halal Certified", type: "standard" },
    { label: "✡️ Kosher Approved", type: "standard" },
    { label: "⚡ Quick & Easy", type: "style" },
    { label: "🍲 One-Pot Meals", type: "style" },
    { label: "👨‍👩‍👧 Kid-Friendly", type: "style" },
    { label: "💰 Budget-Friendly", type: "style" }
  ];

  // ── SELECTION LOGIC ──
  const handleSelectPrimary = (label: string, type: string) => {
    updateState({
      primaryBadge: label,
      primaryType: type
    });
    rebuildOrdered({ primary: label, pType: type });
  };

  const handleToggleSecondary = (label: string, type: string) => {
    const exists = state.secondaryBadges.find((b) => b.label === label);
    let nextSec = [];
    if (exists) {
      nextSec = state.secondaryBadges.filter((b) => b.label !== label);
    } else {
      nextSec = [...state.secondaryBadges, { label, type }];
    }
    updateState({ secondaryBadges: nextSec });
    rebuildOrdered({ secondary: nextSec });
  };

  const handleAddCustom = () => {
    const formatted = customInput.trim();
    if (!formatted) return;
    if (state.customBadges.includes(formatted)) {
      setCustomInput("");
      return;
    }
    const nextCustom = [...state.customBadges, formatted];
    updateState({ customBadges: nextCustom });
    rebuildOrdered({ custom: nextCustom });
    setCustomInput("");
  };

  const handleRemoveCustom = (c: string) => {
    const nextCustom = state.customBadges.filter((x) => x !== c);
    updateState({ customBadges: nextCustom });
    rebuildOrdered({ custom: nextCustom });
  };

  // Re-consolidate orderedBadges (priority list)
  const rebuildOrdered = (overrides: {
    primary?: string | null;
    pType?: string;
    secondary?: { label: string; type: string }[];
    custom?: string[];
  }) => {
    const prim = overrides.primary !== undefined ? overrides.primary : state.primaryBadge;
    const pType = overrides.pType !== undefined ? overrides.pType : state.primaryType;
    const sec = overrides.secondary !== undefined ? overrides.secondary : state.secondaryBadges;
    const cust = overrides.custom !== undefined ? overrides.custom : state.customBadges;

    const rawList: { label: string; type: string }[] = [];
    if (prim) {
      rawList.push({ label: prim, type: pType });
    }
    sec.forEach((s) => {
      if (!rawList.some((r) => r.label === s.label)) {
        rawList.push(s);
      }
    });
    cust.forEach((c) => {
      const label = `🔖 ${c}`;
      if (!rawList.some((r) => r.label === label)) {
        rawList.push({ label, type: "custom" });
      }
    });

    // Merge/preserve existing layout order where appropriate
    const finalOrdered = state.orderedBadges.filter((ob) => rawList.some((r) => r.label === ob.label));
    const newItems = rawList.filter((r) => !finalOrdered.some((fo) => fo.label === r.label));

    updateState({
      orderedBadges: [...finalOrdered, ...newItems]
    });
  };

  const handleMoveBadge = (index: number, direction: number) => {
    const nextIdx = index + direction;
    if (nextIdx < 0 || nextIdx >= state.orderedBadges.length) return;
    const clone = [...state.orderedBadges];
    const temp = clone[index];
    clone[index] = clone[nextIdx];
    clone[nextIdx] = temp;
    updateState({ orderedBadges: clone });
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Configuration Side */}
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex border-b border-lightgray/40 pb-2">
          {["Primary Badge", "Auxiliary Badges", "Priority & Custom", "Review Profile"].map((label, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 text-center py-2 text-xs font-bold border-b-3 transition-colors ${
                currentStep === idx
                  ? "border-sagedark text-sagedark"
                  : "border-transparent text-midgray hover:text-charcoal"
              }`}
            >
              Slot {idx + 1}: {label}
            </button>
          ))}
        </div>

        {/* Dynamic step rendering */}
        <div className="rounded-2xl border border-lightgray/70 bg-white p-6 shadow-sm min-h-[460px] flex flex-col justify-between">
          <div className="space-y-6">
            {/* STEP 0: Primary Badge */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="font-serif font-bold text-xl text-charcoal">Design Lead-Badge</h3>
                  <p className="text-xs text-midgray mt-0.5">
                    This represents the dominant theme of your entire handbook. It receives premier placement and a larger size at checkout.
                  </p>
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                  {primaryBadgeOptions.map((opt) => {
                    const isSel = state.primaryBadge === opt.label;
                    return (
                      <button
                        key={opt.label}
                        onClick={() => handleSelectPrimary(opt.label, opt.type)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all text-left ${
                          isSel
                            ? opt.type === "ags"
                              ? "bg-terracotta border-terracotta text-white"
                              : opt.type === "cancer"
                              ? "bg-sagedark border-sagedark text-white"
                              : "bg-sage border-sage text-white"
                            : "bg-cream border-lightgray text-charcoal hover:bg-neutral-100"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 1: Aux / Secondary Badges */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="font-serif font-bold text-xl text-charcoal">Select Auxiliary Conditions</h3>
                  <p className="text-xs text-midgray mt-0.5">
                    Select any secondary constraints or cooking style targets. These help readers filter down their recipe cards securely.
                  </p>
                </div>

                {/* Allergen Category */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-terracotta uppercase tracking-[0.08em] block">
                    Allergen-Free & Medical
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {secondaryBadgeOptions
                      .filter((o) => o.type === "ags" || o.type === "cancer")
                      .map((opt) => {
                        const isSel = state.secondaryBadges.some((b) => b.label === opt.label);
                        return (
                          <button
                            key={opt.label}
                            onClick={() => handleToggleSecondary(opt.label, opt.type)}
                            className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${
                              isSel
                                ? opt.type === "ags"
                                  ? "bg-terracottadark border-terracottadark text-white"
                                  : "bg-sagedark border-sagedark text-white"
                                : "bg-[#FAF7F2] border-lightgray text-charcoal hover:bg-neutral-100"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Standard and Style Category */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-sagedark uppercase tracking-[0.08em] block">
                    Dietary Lifestyle & Kitchen Style
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {secondaryBadgeOptions
                      .filter((o) => o.type !== "ags" && o.type !== "cancer")
                      .map((opt) => {
                        const isSel = state.secondaryBadges.some((b) => b.label === opt.label);
                        return (
                          <button
                            key={opt.label}
                            onClick={() => handleToggleSecondary(opt.label, opt.type)}
                            className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${
                              isSel
                                ? "bg-sage border-sage text-white"
                                : "bg-[#FAF7F2] border-lightgray text-charcoal hover:bg-neutral-100"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Custom Badges and Draggable priority */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif font-bold text-xl text-charcoal">Design Custom Brand Badge</h3>
                    <p className="text-xs text-midgray mt-0.5">
                      Have a unique medical term like "AIP", "FODMAP", or "Chemo-Approved"? Register it below!
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={25}
                      placeholder="e.g. Low-Histamine, Organic-Only..."
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
                      className="flex-1 px-4 py-2.5 rounded-lg border-2 border-lightgray focus:border-sage outline-none text-xs bg-cream/70"
                    />
                    <button
                      onClick={handleAddCustom}
                      className="rounded-lg bg-sagedark hover:bg-sage text-white px-4 py-2 text-xs font-bold"
                    >
                      + Save Tag
                    </button>
                  </div>

                  {state.customBadges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {state.customBadges.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center gap-1.5 rounded-full bg-cream border border-lightgray px-3 py-1 text-xs font-bold text-charcoal"
                        >
                          🔖 {c}
                          <button
                            onClick={() => handleRemoveCustom(c)}
                            className="bg-neutral-200 text-neutral-600 rounded-full h-4.5 w-4.5 flex items-center justify-center text-[10px] hover:bg-red-500 hover:text-white"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Priority Sorter */}
                <div className="space-y-3 pt-3 border-t border-lightgray/40">
                  <div>
                    <h4 className="font-serif font-bold text-charcoal text-sm">Badge Priority Order</h4>
                    <p className="text-[10px] text-midgray mt-0.5">
                      The top badge gains the premier styling. Put critical safety indicators first (e.g. Alpha-Gal Safe).
                    </p>
                  </div>

                  <div className="space-y-1.5 max-h-[220px] overflow-y-auto no-scrollbar">
                    {state.orderedBadges.map((b, idx) => (
                      <div
                        key={b.label}
                        className="flex items-center justify-between rounded-lg border border-lightgray/60 p-2.5 bg-cream/35 text-xs"
                      >
                        <div className="flex items-center gap-2 font-bold">
                          <span className={`h-2.5 w-2.5 rounded-full ${
                            b.type === "ags"
                              ? "bg-terracotta"
                              : b.type === "cancer"
                              ? "bg-sagedark"
                              : "bg-[#7A9E7E]"
                          }`} />
                          <span>{b.label}</span>
                          {idx === 0 && (
                            <span className="rounded bg-goldlight text-terracottadark font-bold px-1.5 py-0.5 text-[8px] uppercase">
                              Primary
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveBadge(idx, -1)}
                            disabled={idx === 0}
                            className="h-6 w-6 rounded border border-neutral-200 hover:bg-white flex items-center justify-center disabled:opacity-20 text-[10px]"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleMoveBadge(idx, 1)}
                            disabled={idx === state.orderedBadges.length - 1}
                            className="h-6 w-6 rounded border border-neutral-200 hover:bg-white flex items-center justify-center disabled:opacity-20 text-[10px]"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Complete Review Summary */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h3 className="font-serif font-bold text-xl text-sagedark">Dietary Profile Secured</h3>
                  <p className="text-xs text-midgray mt-0.5">
                    Your handbook-wide brand tags are locked in! When drafting recipe cards in Module 5, these tags pre-populate automatically for you.
                  </p>
                </div>

                <div className="rounded-xl border border-lightgray/55 bg-[#FAF7F2] p-5 space-y-4">
                  <div className="flex justify-between border-b border-lightgray/50 pb-2">
                    <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider">Primary Category</span>
                    <span className="text-xs font-bold text-charcoal">{state.primaryBadge || "None"}</span>
                  </div>
                  <div className="flex justify-between border-b border-lightgray/50 pb-2">
                    <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider">Secondary Badges</span>
                    <span className="text-xs font-bold text-charcoal">
                      {state.secondaryBadges.map((b) => b.label).join(", ") || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-lightgray/50 pb-2">
                    <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider">Custom Profile Badges</span>
                    <span className="text-xs font-bold text-charcoal">
                      {state.customBadges.join(", ") || "None"}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider">Default Core Order</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-sm">
                      {state.orderedBadges.map((b) => (
                        <span key={b.label} className="rounded bg-sagedark/10 text-sagedark font-bold px-1.5 py-0.5 text-[10px]">
                          {b.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-goldlight/25 border border-gold/40 p-4 text-xs leading-relaxed text-charcoal">
                  💡 <strong>State Sync Enabled:</strong> The Recipe Builder will inherit this exact layout. If any individual recipe requires an override (e.g. adding a "Nut-Free" badge specifically for a cookie), you can customize it per-recipe!
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-lightgray/40 flex justify-between">
            <button
              onClick={() => {
                if (currentStep > 0) setCurrentStep(currentStep - 1);
              }}
              disabled={currentStep === 0}
              className="px-4 py-2 font-bold text-xs text-midgray hover:text-charcoal disabled:opacity-20 transition-all font-sans"
            >
              ← Back
            </button>

            {currentStep < TOTAL_STEPS - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="rounded-lg bg-sagedark hover:bg-sage text-white px-5 py-2 text-xs font-bold shadow-sm transition-all"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={() => onNavigate(3)}
                className="rounded-lg bg-terracotta hover:bg-terracottadark text-white px-5 py-2 text-xs font-bold shadow-sm transition-all"
              >
                Proceed to Design 🎨
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Widget Preview Side (Positioned Below Main Config Block) */}
      <div className="bg-warmwhite rounded-2xl border border-lightgray/60 p-6 flex flex-col justify-between max-w-2xl mx-auto w-full">
        <div>
          <span className="flex items-center gap-1.5">
            <span className="live-dot" />
            <h4 className="text-[10px] font-bold text-midgray uppercase tracking-widest">
              Live Badge Preview
            </h4>
          </span>
          <p className="text-[11px] text-midgray mt-1 leading-normal leading-relaxed">
            This demonstrates how your priority order will render beautifully on card interiors.
          </p>
        </div>

        {/* Live Card Interior Rendering */}
        <div className="rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm space-y-4 my-6">
          <div className="bg-sagedark rounded-lg p-3 text-white">
            {/* Badges preview row */}
            <div className="flex flex-wrap gap-1 mb-2">
              {state.orderedBadges.map((b) => (
                <span
                  key={b.label}
                  className={`text-[8px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full ${
                    b.type === "ags" ? "bg-terracotta text-white" : "bg-white/25 text-white"
                  }`}
                >
                  {b.label}
                </span>
              ))}
            </div>

            <h5 className="font-serif font-bold text-[14px]">
              {state.title || "Sample Heirloom Dish"}
            </h5>
            <span className="text-[9px] text-white/50 block">Prep: 15 mins · Cook: 30 mins</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-charcoal/85">
            <div className="flex items-center gap-2 border-b border-lightgray/40 pb-1.5">
              <div className="h-3 w-3 border border-sage rounded-sm" />
              <strong className="text-sagedark">2 cups</strong>
              <span>Organic Vegetable Stock</span>
            </div>
            <div className="flex items-center gap-2 border-b border-lightgray/40 pb-1.5">
              <div className="h-3 w-3 border border-sage rounded-sm" />
              <strong className="text-sagedark">1 tbsp</strong>
              <span>Infused Extra Virgin Olive Oil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 border border-sage rounded-sm" />
              <strong className="text-sagedark">1 clove</strong>
              <span>Fresh Garlic-Garlic, crushed</span>
            </div>
          </div>
        </div>

        <div>
          <span className="block text-[11px] text-midgray text-center font-medium bg-cream p-2.5 rounded-md italic">
            "Prioritize what secures safety or healing first."
          </span>
        </div>
      </div>
    </div>
  );
}
