import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Calculator, Search, Clipboard, Check, Copy } from "lucide-react";
import { GlobalState } from "../types";

interface Module6Props {
  state: GlobalState;
  updateState: (fields: Partial<GlobalState>) => void;
  onNavigate: (module: number) => void;
}

export default function Module6Publishing({ state, updateState, onNavigate }: Module6Props) {
  const [activeTab, setActiveTab] = useState<"calculator" | "isbn" | "keywords" | "checklist">("calculator");
  
  // Royalty Calculator Inputs
  const [price, setPrice] = useState(24.99);
  const [pages, setPages] = useState(150);
  const [printType, setPrintType] = useState<"color" | "bw">("color");

  // Keyword Builder Inputs
  const [kwDiet, setKwDiet] = useState("Alpha-Gal Safe");
  const [kwTheme, setKwTheme] = useState("Garden-to-Table");
  const [kwAudience, setKwAudience] = useState("Families");
  const [kwAngle, setKwAngle] = useState("");

  const checklistItems = [
    { id: 0, text: "All recipe titles are finalized and spelled correctly", required: true },
    { id: 1, text: "Recipe titles are unique and searchable in search engines", required: false },
    { id: 2, text: "Copyright page includes year, your name, and rights parameters", required: true },
    { id: 3, text: "Introduction written explaining your personal story and health mission", required: false },
    { id: 4, text: "Page numbers are manually added on all project sheets", required: true },
    { id: 5, text: "Table of Contents page links correspond correctly to internal pages", required: true },
    { id: 6, text: "Resolution of all interior food graphics is 300 DPI or higher", required: true },
    { id: 7, text: "KDP interior PDF is exported with Bleed setting turned OFF", required: true },
    { id: 8, text: "Ingram Spark interior PDF is exported with Bleed setting turned ON", required: true },
    { id: 9, text: "Your own Bowker ISBN is acquired (if publishing outside Amazon)", required: true },
    { id: 10, text: "W-9 tax question and bank credentials entered inside KDP account", required: true },
    { id: 11, text: "Retail book description drafted (150-400 words)", required: true },
    { id: 12, text: "7 strategic KDP keywords entered properly in indexing boxes", required: true },
    { id: 13, text: "Print price set using royalty margin constraints", required: true },
    { id: 14, text: "Author Central page created at authorcentral.amazon.com", required: false },
  ];

  // ── ROYALTY FORMULAS ──
  const calcKdpCost = () => {
    const base = 0.85;
    const ppp = printType === "color" ? 0.07 : 0.012;
    return base + (ppp * pages);
  };

  const calcKdpRoyalty = () => {
    const cost = calcKdpCost();
    const margin = price * 0.60 - cost;
    return Math.max(0, margin);
  };

  const calcIngramCost = () => {
    const base = printType === "color" ? 1.10 : 0.90;
    const ppp = printType === "color" ? 0.08 : 0.015;
    return base + (ppp * pages);
  };

  const calcIngramRoyalty = () => {
    const cost = calcIngramCost();
    const wholesale = price * 0.45; // 45% standard wholesale discount rate
    const fee = price * 0.01875;
    return Math.max(0, wholesale - cost - fee);
  };

  const calcEtsyRoyalty = () => {
    const txnFee = price * 0.065;
    const cardProc = price * 0.03 + 0.25;
    return Math.max(0, price - txnFee - cardProc - 0.20);
  };

  const kdpRoy = calcKdpRoyalty();
  const ingramRoy = calcIngramRoyalty();
  const etsyRoy = calcEtsyRoyalty();

  // Recharts Chart Data
  const chartData = [
    { name: "KDP Print", royalty: parseFloat(kdpRoy.toFixed(2)), color: "#7A9E7E" },
    { name: "Ingram Print", royalty: parseFloat(ingramRoy.toFixed(2)), color: "#C4714A" },
    { name: "Etsy Digital", royalty: parseFloat(etsyRoy.toFixed(2)), color: "#C9A84C" }
  ];

  // ── KEYWORD CREATOR ──
  const buildKeywordsList = () => {
    const anglePart = kwAngle.trim().toLowerCase();
    return [
      `${kwDiet} Cookbook`,
      `${kwDiet} recipes for ${kwAudience}`,
      `${kwTheme} Cookbook ${kwDiet}`,
      `${kwDiet} ${kwTheme} recipes`,
      anglePart ? `${anglePart} cookbook` : `healthy ${kwDiet} meals`,
      `${kwAudience} ${kwDiet} cooking`,
      anglePart ? `${anglePart} ${kwDiet} recipes` : `${kwDiet} cookbook for ${kwAudience}`
    ].map((kw) => kw.replace(/\s+/g, " ").trim().substring(0, 50));
  };

  const generatedKeywords = buildKeywordsList();

  const handleCopyKW = (kw: string) => {
    navigator.clipboard.writeText(kw).then(() => {
      alert(`Copied: "${kw}"! Ready to paste on KDP.`);
    });
  };

  const handleToggleCheck = (id: number) => {
    const nextCheckList = { ...state.publishingChecklistState, [id]: !state.publishingChecklistState[id] };
    updateState({ publishingChecklistState: nextCheckList });
  };

  const totalChecked = Object.values(state.publishingChecklistState).filter(Boolean).length;
  const progressPercent = Math.round((totalChecked / checklistItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* Sub tabs nav */}
      <div className="flex bg-white rounded-xl border border-lightgray/55 p-1 max-w-md mx-auto shadow-sm">
        {["Calculator", "ISBN Tree", "KDP Keywords", "Audit Checklist"].map((label, idx) => {
          const tabKeys = ["calculator", "isbn", "keywords", "checklist"];
          const key = tabKeys[idx];
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === key ? "bg-sagedark text-white shadow-sm" : "text-midgray hover:text-charcoal"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {activeTab === "calculator" && (
        <div className="grid gap-6 md:grid-cols-12 animate-fadeIn">
          {/* Inputs Form */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-lightgray/60 p-6 space-y-5 shadow-sm">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <Calculator className="h-5 w-5 text-sagedark" /> Retail Royalty Calculator
              </h3>
              <p className="text-[11px] text-midgray mt-0.5">
                Adjust pricing coordinates matching active 2026 self-publishing structures.
              </p>
            </div>

            <div className="space-y-4 text-xs font-semibold text-sagedark uppercase tracking-wider">
              <div className="space-y-1">
                <label className="text-[10px] tracking-wide block">List retail price (USD)</label>
                <input
                  type="number"
                  min="0.99"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Math.max(0.99, parseFloat(e.target.value) || 0.99))}
                  className="w-full px-3 py-2 border border-lightgray rounded bg-cream/35 outline-none font-bold text-charcoal font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wide block">Page Count</label>
                <input
                  type="number"
                  min="16"
                  value={pages}
                  onChange={(e) => setPages(Math.max(16, parseInt(e.target.value) || 16))}
                  className="w-full px-3 py-2 border border-lightgray rounded bg-cream/35 outline-none font-bold text-charcoal font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] tracking-wide block">Print Type Category</label>
                <select
                  value={printType}
                  onChange={(e) => setPrintType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-lightgray rounded bg-cream/35 outline-none font-bold text-charcoal"
                >
                  <option value="color">Full Color Interior</option>
                  <option value="bw">Black &amp; White Interior</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg bg-goldlight/25 border border-gold/30 p-3 text-[11px] leading-relaxed text-charcoal">
              📈 <strong>Margin Recommendation:</strong> For physical cookbooks, aim for list prices above $20 for Color templates, ensuring you retain at least a $3-4 margin margin to offset printing costs.
            </div>
          </div>

          {/* Graph Output with Recharts */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-lightgray/60 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="font-serif font-bold text-charcoal text-base">Royalty Income Comparison</h4>
              <p className="text-[11px] text-midgray mt-0.5 leading-normal">
                Estimated earnings accrued per individual transaction across core retail systems.
              </p>
            </div>

            <div className="h-64 my-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6B6B6B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#6B6B6B" fontSize={11} tickLine={false} />
                  <Tooltip formatter={(value) => [`$${value}`, "Royalty"]} />
                  <Bar dataKey="royalty" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-sage/10 text-sagedark rounded-lg">
                <span className="block text-[9px] uppercase font-bold">KDP Print</span>
                <strong className="block text-lg">${kdpRoy.toFixed(2)}</strong>
              </div>
              <div className="p-3 bg-terracotta/10 text-terracottadark rounded-lg">
                <span className="block text-[9px] uppercase font-bold">Ingram Print</span>
                <strong className="block text-lg">${ingramRoy.toFixed(2)}</strong>
              </div>
              <div className="p-3 bg-gold/10 text-gold rounded-lg">
                <span className="block text-[9px] uppercase font-bold">Etsy Digital</span>
                <strong className="block text-lg">${etsyRoy.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "isbn" && (
        <div className="rounded-2xl bg-white border border-lightgray/60 p-6 space-y-6 shadow-sm animate-fadeIn">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal">The ISBN Decision Tree</h3>
            <p className="text-xs text-midgray mt-0.5">
              Decide whether purchasing a customized serial is required for your brand expansion.
            </p>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-charcoal">
            <div className="flex gap-4 items-start p-3 bg-cream/35 rounded-xl border border-lightgray/40">
              <span className="h-6 w-6 rounded-full bg-sagedark text-white font-bold flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <strong className="font-serif bold block text-sm">Selling Digital E-Books on Etsy?</strong>
                <p className="text-midgray mt-0.5">No ISBN is required. Digital deliverables require zero serial indexing. Set up and launch instantly!</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-3 bg-cream/35 rounded-xl border border-lightgray/40">
              <span className="h-6 w-6 rounded-full bg-sagedark text-white font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <strong className="font-serif bold block text-sm">Selling physical copies on Amazon ONLY?</strong>
                <p className="text-midgray mt-0.5">Opt for KDP's free assigned ISBN option. It requires zero budget. The trade-off is Amazon shows the imprint name as "Independently Published" on your product detail page.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-3 bg-cream/35 rounded-xl border border-lightgray/40">
              <span className="h-6 w-6 rounded-full bg-terracotta text-white font-bold flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <strong className="font-serif bold block text-sm">Selling physically in local bookstores or libraries?</strong>
                <p className="text-[#8B4A2E] mt-0.5">You must purchase an official ISBN package from Bowker (USA) via myidentifiers.com. Neither Ingram Spark nor bookstores accept Amazon's free assigned serial code.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "keywords" && (
        <div className="rounded-2xl bg-white border border-lightgray/60 p-6 space-y-6 shadow-sm animate-fadeIn">
          <div>
            <h3 className="font-serif text-xl font-bold text-charcoal">KDP Indexing Keyword Builder</h3>
            <p className="text-xs text-midgray mt-0.5">
              Amazon provides exactly 7 search indexes (up to 50 characters each). Maximize reach using structural combinations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-sagedark uppercase tracking-wider block">Diet Tag Pivot</label>
              <select
                value={kwDiet}
                onChange={(e) => setKwDiet(e.target.value)}
                className="w-full px-3 py-2 bg-cream/40 rounded border border-lightgray outline-none font-bold"
              >
                <option>Alpha-Gal Safe</option>
                <option>Gluten-Free</option>
                <option>Dairy-Free</option>
                <option>Vegan</option>
                <option>Cancer Support</option>
                <option>Low-Sodium</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-sagedark uppercase tracking-wider block">Theme Pivot</label>
              <select
                value={kwTheme}
                onChange={(e) => setKwTheme(e.target.value)}
                className="w-full px-3 py-2 bg-cream/40 rounded border border-lightgray outline-none font-bold"
              >
                <option>Garden-to-Table</option>
                <option>Family Recipes</option>
                <option>Quick Dinners</option>
                <option>Country Baking</option>
                <option>Immune Healing</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-sagedark uppercase tracking-wider block">Audience Pivot</label>
              <select
                value={kwAudience}
                onChange={(e) => setKwAudience(e.target.value)}
                className="w-full px-3 py-2 bg-cream/40 rounded border border-lightgray outline-none font-bold"
              >
                <option>Families</option>
                <option>Beginners</option>
                <option>Caregivers</option>
                <option>Empty Nesters</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-sagedark uppercase tracking-wider block">Unique Story Element</label>
              <input
                type="text"
                placeholder="e.g. tick allergy, organic soil..."
                value={kwAngle}
                onChange={(e) => setKwAngle(e.target.value)}
                className="w-full px-3 py-2 bg-cream/40 rounded border border-lightgray outline-none text-xs font-semibold"
              />
            </div>
          </div>

          <div className="rounded-xl border border-lightgray bg-[#FAF7F2] p-5 space-y-3">
            <span className="text-[10px] font-bold text-sagedark uppercase tracking-widest block">
              Your 7 Amazon KDP Keyword Strings — Click to Copy
            </span>
            <div className="flex flex-wrap gap-2">
              {generatedKeywords.map((kw, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopyKW(kw)}
                  className="flex items-center gap-2 rounded bg-white hover:bg-neutral-50 px-3 py-2 border border-neutral-200 text-xs text-charcoal font-semibold text-left select-all group shadow-xs"
                >
                  <Copy className="h-3 w-3 text-midgray group-hover:text-sagedark" />
                  <span>{kw}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "checklist" && (
        <div className="rounded-2xl bg-white border border-lightgray/60 p-6 space-y-6 shadow-sm animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-lightgray/40 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal">Pre-Submission Diagnostics</h3>
              <p className="text-xs text-midgray mt-0.5">
                Ensure perfect alignment before locking files inside print systems.
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
              const checked = state.publishingChecklistState[item.id] || false;
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
                  <div className="flex-1">
                    <p className={`font-semibold ${checked ? "line-through text-midgray/70" : ""}`}>{item.text}</p>
                    <span className={`text-[8px] rounded px-1.5 py-0.5 inline-block mt-1 font-bold ${
                      item.required ? "bg-red-50 text-red-600" : "bg-neutral-100 text-neutral-500"
                    }`}>
                      {item.required ? "REQUIRED" : "RECOMMENDED"}
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
          onClick={() => onNavigate(5)}
          className="rounded-lg border-2 border-lightgray hover:border-charcoal bg-white text-midgray hover:text-charcoal px-4 py-2 text-xs font-bold transition-all"
        >
          ← Back to Recipe Card Builder
        </button>
        <button
          onClick={() => onNavigate(7)}
          className="rounded-lg bg-terracotta hover:bg-terracottadark text-white px-5 py-2.5 text-xs font-bold shadow-sm transition-all"
        >
          Proceed to Marketing Kit 📣
        </button>
      </div>
    </div>
  );
}
