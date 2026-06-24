import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Film, Image as ImageIcon, Send, Copy, Hash, Award, CheckCircle } from "lucide-react";
import { GlobalState } from "../types";

interface Module7Props {
  state: GlobalState;
  updateState: (fields: Partial<GlobalState>) => void;
  onNavigate: (module: number) => void;
}

export default function Module7Marketing({ state, updateState, onNavigate }: Module7Props) {
  const [activeTab, setActiveTab] = useState<"guides" | "recommender" | "scripts" | "timeline">("guides");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [capPlatform, setCapPlatform] = useState("Instagram");
  const [capType, setCapType] = useState("Recipe Preview");
  const [capTone, setCapTone] = useState("Warm & Relatable");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const scriptsData = [
    {
      title: "🎬 Script 1: 'Allergic to Mammals now?'",
      duration: "30 seconds",
      hook: "Show a real lone star tick photo or point to backyards. 'I never thought a single bug bite would stop me from eating bacon...'",
      body: "Cut from doctor reports to delicious sizzle sounds of alternative turkey/duck pans. Explain how you customized legacy farm pies to remain safe.",
      cta: "Hold up the cover! 'Get exactly 50+ tick-safe family recipes in my cookbook—link in bio!'"
    },
    {
      title: "🎬 Script 2: 'Oncology Recovery Soup'",
      duration: "45 seconds",
      hook: "Gentle natural light near a kitchen window. 'Active chemotherapy can steal your appetite. This is the exact broth that kept my nutrition high.'",
      body: "Stir fresh organic mushrooms, turmeric, skinless chicken pieces in slow-motion. Point out anti-inflammatory properties clearly.",
      cta: "Warm smile. 'I compiled every healing recipe I tested during my battle. Link in bio to grab a KDP copy.'"
    },
    {
      title: "🎬 Script 3: 'Garden Backyard Harvest'",
      duration: "20 seconds",
      hook: "Walking barefoot through tomato vines. 'Let's cook what I pulled out of the rural Missouri soil 15 minutes ago!'",
      body: "Clip garden greens, wash them quickly, sauté with sea salt and garlic. Show beautiful plated food overlays in fast cuts.",
      cta: "Etsy templates and links. 'My full garden-to-table roadmap is ready — download link sits in bio!'"
    }
  ];

  const hashtagGroups = [
    { title: "AGS & Allergy", tags: ["#alphagalsyndrome", "#alphagal", "#mammalfree", "#allergyfriendly", "#beeffree", "#porkfree", "#tickbite", "#allergycooking"] },
    { title: "Recovery nutrition", tags: ["#cancerrecovery", "#chemodiet", "#immuneboost", "#healingfoods", "#antiinflammatory", "#guthealth", "#cancersurvivor"] },
    { title: "Wholesome farming", tags: ["#gardentotable", "#growyourown", "#homesteading", "#farmfresh", "#organicgardening", "#harvestseasonal"] },
    { title: "Indie Publishing", tags: ["#selfpublishing", "#indieauthor", "#newcookbook", "#recipeoftheday", "#homecooking", "#foodphotography"] }
  ];

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCopyTags = () => {
    if (selectedTags.length === 0) return;
    navigator.clipboard.writeText(selectedTags.join(" ")).then(() => {
      alert("Selected hashtags copied! Paste on social platforms.");
    });
  };

  const handleGenerateCaption = async () => {
    setIsGenerating(true);
    setErrorMsg("");
    setGeneratedCaption("");
    try {
      const summary = `Title: ${state.title || "Specialty diet cookbook"}. Theme: ${state.themes.join(", ")}. Angles: ${state.angleText || state.angles.join(", ")}`;
      const response = await fetch("/api/ai/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: capPlatform,
          type: capType,
          tone: capTone,
          detail: summary
        })
      });
      if (!response.ok) throw new Error("Vite backend failed to write caption");
      const data = await response.json();
      setGeneratedCaption(data.caption);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reach server-side writer. Copy hashtag blocks below instead!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCaption = () => {
    if (!generatedCaption) return;
    navigator.clipboard.writeText(generatedCaption).then(() => {
      alert("AI Caption copied to clipboard! ✓");
    });
  };

  const handleToggleTimelineTask = (id: number) => {
    const nextTimeline = { ...state.marketingChecklistState, [id]: !state.marketingChecklistState[id] };
    updateState({ marketingChecklistState: nextTimeline });
  };

  const timelineItems = [
    { id: 0, week: "Weeks 7-8", text: "Create or optimize social profile handles (folders, tags, headshots) consistently" },
    { id: 1, week: "Weeks 7-8", text: "Pin 5 placeholder boards on Pinterest focusing on primary medical diet search vectors" },
    { id: 2, week: "Weeks 5-6", text: "Post your personal 'Why I wrote this cookbook' text story on Facebook support groups naturally" },
    { id: 3, week: "Weeks 5-6", text: "Record your first TikTok/Reel sharing the diagnosis or recovery turning points" },
    { id: 4, week: "Weeks 3-4", text: "Distribute 3 Advance Reader Copies (PDF layout) to local community advocates for testimonials" },
    { id: 5, week: "Weeks 3-4", text: "Launch early pre-hype on Etsy listing mockups displaying sample cookbook pages" },
    { id: 6, week: "Launch Week", text: "Unleash launch posts simultaneously, link Amazon Author Central live, and reply to all reader notes!" },
  ];

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex bg-white rounded-xl border border-lightgray/55 p-1 max-w-md mx-auto shadow-sm">
        {["Guides", "AI Copywriter", "Film Storyboards", "Launch Tracker"].map((label, idx) => {
          const tabKeys = ["guides", "recommender", "scripts", "timeline"];
          const key = tabKeys[idx];
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === key ? "bg-sagedark text-white shadow-sm" : "text-midgray hover:text-charcoal"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {activeTab === "guides" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-2xl bg-white border border-lightgray/60 p-6 space-y-4 shadow-sm">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">Visual Pinboard Setup (Pinterest Blueprint)</h3>
              <p className="text-xs text-midgray mt-0.5">
                Pinterest serves as a high-volume visual search engine. Tap into organic gardening searches directly.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-lightgray/40 space-y-2">
                <span className="text-[10px] font-bold text-terracottadark uppercase tracking-wider block">
                  How-To Keyword Recipe Pins
                </span>
                <p className="text-xs text-charcoal/80 leading-relaxed">
                  Design long vertical templates (2:3 aspect ratio, 1000px × 1500px) in Canva free. Feature bold titles pairing words: <strong>Easy Alpha-Gal Safe</strong> or <strong>Cancer Healing Breakfast</strong>. Pin linking back directly to Amazon retail pages.
                </p>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-lightgray/40 space-y-2">
                <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                  Infographic Advice Pins
                </span>
                <p className="text-xs text-charcoal/80 leading-relaxed">
                  Draw 'Hidden Mammal Ingredients' templates detailing gelatin, carmine, lard, and common cross-contaminants. These establish authoritative medical trust, yielding high save volumes that resurface seasonally.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "recommender" && (
        <div className="rounded-2xl bg-white border border-lightgray/60 p-6 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold animate-bounce" /> Server-Side Copywriter Agent
            </h3>
            <p className="text-xs text-midgray mt-0.5 leading-relaxed">
              Instruct Gemini to assemble highly targeted, beautiful promo copy natively formatted with spacing limits.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-sagedark block uppercase tracking-wider">Platform Target</label>
              <select
                value={capPlatform}
                onChange={(e) => setCapPlatform(e.target.value)}
                className="w-full px-3 py-2 border border-lightgray rounded outline-none font-bold"
              >
                <option>Instagram</option>
                <option>Facebook Groups</option>
                <option>TikTok Description</option>
                <option>Pinterest Board description</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-sagedark block uppercase tracking-wider">Post Type Goal</label>
              <select
                value={capType}
                onChange={(e) => setCapType(e.target.value)}
                className="w-full px-3 py-2 border border-lightgray rounded outline-none font-bold"
              >
                <option>Recipe Preview</option>
                <option>Launch Day announcement</option>
                <option>My Survival/Health Story</option>
                <option>Cooking Substitution Tip</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-sagedark block uppercase tracking-wider">Brand Voice</label>
              <select
                value={capTone}
                onChange={(e) => setCapTone(e.target.value)}
                className="w-full px-3 py-2 border border-lightgray rounded outline-none font-bold"
              >
                <option>Warm &amp; Relatable</option>
                <option>Educational &amp; Fact-based</option>
                <option>Inspiring Survivor story</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateCaption}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-gold hover:bg-[#a8872e] text-white px-5 py-2.5 text-xs font-bold shadow transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                Drafting Caption Elements...
              </>
            ) : (
              "✨ Write custom engagement blurb"
            )}
          </button>

          {errorMsg && <p className="text-xs text-red-600 font-semibold italic">{errorMsg}</p>}

          {generatedCaption && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-sagedark block uppercase tracking-widest">
                AI Draft Result — Paste on Socials
              </span>
              <div
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 font-mono text-[11px] leading-relaxed text-charcoal select-all whitespace-pre-wrap cursor-pointer"
                onClick={handleCopyCaption}
                title="Click anywhere to copy"
              >
                {generatedCaption}
              </div>
              <button
                onClick={handleCopyCaption}
                className="flex items-center gap-1.5 rounded-lg bg-cream hover:bg-neutral-100 border border-lightgray px-4 py-2 text-xs font-bold text-charcoal"
              >
                <Copy className="h-4 w-4 text-midgray" /> Copy Caption String
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "scripts" && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal">Short-Video Storyboards (TikTok &amp; Reels)</h3>
            <p className="text-xs text-midgray mt-0.5">
              Engaging narrative hooks built specifically to generate organic specialty diet leads.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {scriptsData.map((s, idx) => (
              <div key={idx} className="bg-white border border-lightgray/55 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-lightgray/40 pb-2">
                  <h4 className="font-serif font-bold text-charcoal text-sm">{s.title}</h4>
                  <span className="text-[10px] bg-neutral-100 font-bold px-2 py-0.5 rounded text-neutral-500">{s.duration}</span>
                </div>
                <div className="text-xs space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-terracotta uppercase">1. Opening Hook (0-5s)</span>
                    <p className="text-charcoal/80 leading-relaxed font-semibold">"{s.hook}"</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[#8B4A2E] uppercase">2. Middle Payload (5-20s)</span>
                    <p className="text-midgray leading-relaxed italic">{s.body}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-sagedark uppercase">3. Call to Action (20-30s)</span>
                    <p className="text-sagedark font-bold">{s.cta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="space-y-4 bg-white p-6 rounded-2xl border border-lightgray/60 shadow-sm animate-fadeIn">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal">8-Week Campaign Launch Tracker</h3>
            <p className="text-xs text-midgray mt-0.5">
              Prepare audience channels beforehand to capture launch momentum. Click tasks to toggle complete.
            </p>
          </div>

          <div className="space-y-2">
            {timelineItems.map((item) => {
              const checked = state.marketingChecklistState[item.id] || false;
              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleTimelineTask(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    checked
                      ? "bg-mentor-bg/30 border-sage/60 text-midgray"
                      : "bg-[#FAF7F2]/40 border-lightgray text-charcoal hover:border-sage"
                  }`}
                >
                  <div className={`p-0.5 rounded border-2 flex items-center justify-center mt-0.5 ${
                    checked ? "bg-sagedark border-sagedark text-white" : "border-neutral-300"
                  }`}>
                    {checked && <CheckCircle className="h-3.5 w-3.5" />}
                  </div>
                  <div>
                    <span className="text-[9px] bg-neutral-200 text-neutral-600 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider mr-2">
                      {item.week}
                    </span>
                    <span className={`font-semibold ${checked ? "line-through text-midgray/70" : ""}`}>
                      {item.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hashtag banks selector panel */}
      <div className="rounded-2xl bg-white border border-lightgray/60 p-6 space-y-4 shadow-sm animate-fadeIn">
        <div>
          <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-1">
            <Hash className="h-5 w-5 text-sagedark" /> 90+ High-Performance Hashtag Cloud
          </h3>
          <p className="text-xs text-midgray mt-0.5">
            Click tags below to compound a customized set. Perfect to paste on Instagram or TikTok profiles.
          </p>
        </div>

        <div className="space-y-4 divide-y divide-lightgray/40">
          {hashtagGroups.map((g) => (
            <div key={g.title} className="py-2.5 space-y-2">
              <span className="text-[10px] font-bold text-sagedark block uppercase tracking-wider">{g.title}</span>
              <div className="flex flex-wrap gap-1.5">
                {g.tags.map((tag) => {
                  const isSel = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full border text-xs font-bold transition-all ${
                        isSel
                          ? "bg-sagedark border-sagedark text-white"
                          : "bg-cream border-lightgray text-charcoal hover:bg-neutral-100"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {selectedTags.length > 0 && (
          <div className="rounded-xl border border-lightgray bg-[#FAF7F2] p-4 font-mono text-xs text-charcoal space-y-2">
            <span className="text-[9px] font-serif font-bold text-sagedark uppercase tracking-wider block">Compiled Hashtags Set</span>
            <p className="select-all">{selectedTags.join(" ")}</p>
            <button
              onClick={handleCopyTags}
              className="px-3 py-1 font-bold text-xs bg-sagedark text-white rounded mt-1"
            >
              Copy Hashtag Array
            </button>
          </div>
        )}
      </div>

      {/* Graduation/Complete Celebration Panel */}
      <div className="rounded-2xl bg-gradient-to-br from-sagedark to-[#2C4A2E] p-8 text-center text-white space-y-4 shadow-lg">
        <Award className="mx-auto h-12 w-12 text-gold animate-bounce" />
        <h3 className="font-serif text-2xl font-bold text-cream leading-tight">
          Congratulations, Cookbook Author!
        </h3>
        <p className="mx-auto max-w-xl text-xs md:text-sm leading-relaxed text-[#FAF7F2]/80">
          Your creative vision (<strong>{state.title || "Untitled Cookbook Planning Thesis"}</strong>) has been fully mapped out.
          Your badge systems, layout specifications, and royalty calculators are stored in your secure local cache.
          You have successfully transitioned from concept to publishing-ready. 
        </p>
        <p className="font-serif italic text-gold text-sm font-semibold">
          "Your roadmap is fully complete. Now, launch your book into the world!"
        </p>
      </div>

      {/* Absolute final page nav */}
      <div className="pt-6 border-t border-lightgray/40 flex justify-start">
        <button
          onClick={() => onNavigate(6)}
          className="rounded-lg border-2 border-lightgray hover:border-charcoal bg-white text-midgray hover:text-charcoal px-4 py-2 text-xs font-bold transition-all"
        >
          ← Back to Publishing Economics
        </button>
      </div>
    </div>
  );
}

