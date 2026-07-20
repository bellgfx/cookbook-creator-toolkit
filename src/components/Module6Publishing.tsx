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

  // ── ROYALTY FORMULAS (Updated for 2026 Standards) ──
  const calcKdpCost = () => {
    if (printType === "color") {
      const perPage = 0.065; // Standard color page fee
      const base = 1.00;     // Base fee for color print over 40 pages
      const calculated = base + (perPage * pages);
      return pages < 40 ? 3.65 : calculated;
    } else {
      const perPage = 0.015; // Black & White page fee
      const base = 1.00;     // Base fee B&W over 110 pages
      const calculated = base + (perPage * pages);
      return pages < 110 ? 2.30 : calculated;
    }
  };

  // Amazon KDP takes a 40% store cut (for Standard sale), or 60% (for Expanded Distribution)
  const calcKdpRoyalty = () => {
    const cost = calcKdpCost();
    const margin = price * 0.60 - cost; // Standard sale is 60% minus printing cost
    return Math.max(0, margin);
  };

  const calcExpandedKdpRoyalty = () => {
    const cost = calcKdpCost();
    const margin = price * 0.40 - cost; // Expanded distribution is 40% minus printing cost
    return Math.max(0, margin);
  };

  const calcKindleRoyalty = () => {
    // eBooks get a standard 70% royalty on Amazon if priced between $2.99 and $9.99, or 35% otherwise.
    // We'll subtract a small standard $0.15 file delivery fee for 70% royalty eBook delivery costs.
    if (price >= 2.99 && price <= 9.99) {
      return Math.max(0, (price * 0.70) - 0.15);
    } else {
      return Math.max(0, price * 0.35);
    }
  };

  const calcEtsyRoyalty = () => {
    const listingFee = 0.20;
    const transFee = price * 0.065;
    const processingFee = (price * 0.03) + 0.25;
    return Math.max(0, price - transFee - processingFee - listingFee);
  };

  const kdpRoy = calcKdpRoyalty();
  const kindleRoy = calcKindleRoyalty();
  const etsyRoy = calcEtsyRoyalty();

  // Recharts Chart Data
  const chartData = [
    { name: "KDP Print (Physical)", royalty: parseFloat(kdpRoy.toFixed(2)), color: "#7A9E7E" },
    { name: "KDP Kindle (eBook)", royalty: parseFloat(kindleRoy.toFixed(2)), color: "#3B82F6" },
    { name: "Etsy PDF (Digital)", royalty: parseFloat(etsyRoy.toFixed(2)), color: "#C9A84C" }
  ];

  // ── CORE DOWNLOAD HANDLERS ──
  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${state.title ? state.title.toLowerCase().replace(/\s+/g, "_") : "dream_cookbook"}_workspace.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadDOCX = () => {
    let content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${state.title || "My Dream Cookbook"}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 40px; }
          h1 { color: #2E4A34; font-family: Georgia, serif; font-size: 28px; border-bottom: 2px solid #2E4A34; padding-bottom: 5px; }
          h2 { color: #5B7B61; font-family: Georgia, serif; font-size: 20px; margin-top: 30px; }
          h3 { color: #444444; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
          .meta { font-style: italic; color: #666666; margin-bottom: 20px; }
          .ingredients { background-color: #F4F7F4; padding: 15px; border-left: 4px solid #5B7B61; margin-bottom: 20px; }
          .steps { margin-bottom: 30px; }
          .step-item { margin-bottom: 8px; }
          .badge { background-color: #E2ECE3; color: #2E4A34; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>${state.title || "My Dream Cookbook"}</h1>
        <p class="meta">By ${state.authorName || "An Inspired Chef"} — Cookbook Creator Draft</p>
        
        <h2>Cookbook Niche Concept</h2>
        <p><strong>Primary Audience:</strong> ${state.audience.join(", ")}</p>
        <p><strong>Motivation &amp; Brand Story:</strong> ${state.motivationText || "A personal collection of heirloom recipes."}</p>
        <p><strong>Aesthetic Theme:</strong> ${state.themes.join(", ")}</p>
        
        <h2>Recipe Collections</h2>
    `;

    if (state.recipes.length === 0) {
      content += `
        <p><em>No recipe cards have been finalized in Module 5 yet. Go back to Module 5 and write some heirloom classics!</em></p>
      `;
    } else {
      state.recipes.forEach((recipe) => {
        content += `
          <div style="page-break-after: always; border-bottom: 1px solid #DDDDDD; padding-bottom: 20px; margin-bottom: 20px;">
            <h2>${recipe.title}</h2>
            <p><em>${recipe.desc || "No description provided."}</em></p>
            <p><strong>Prep Time:</strong> ${recipe.prepTime || "N/A"} | <strong>Cook Time:</strong> ${recipe.cookTime || "N/A"} | <strong>Servings:</strong> ${recipe.servings || "N/A"} | <strong>Difficulty:</strong> ${recipe.difficulty || "Easy"}</p>
            <p><strong>Diet Tags:</strong> ${recipe.dietTags && recipe.dietTags.length > 0 ? recipe.dietTags.join(", ") : "None"}</p>
            
            <div class="ingredients">
              <h3>Ingredients List:</h3>
              <ul>
                ${recipe.ingredients.map(ing => `<li><strong>${ing.amount} ${ing.unit}</strong> ${ing.name} ${ing.note ? `<em>(${ing.note})</em>` : ""} ${ing.flagged ? "⚠️ (Diet Alert!)" : ""}</li>`).join("")}
              </ul>
            </div>

            <div class="steps">
              <h3>Directions:</h3>
              <ol>
                ${recipe.steps.map(step => `<li>${step}</li>`).join("")}
              </ol>
            </div>
          </div>
        `;
      });
    }

    content += `
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = url;
    downloadAnchor.download = `${state.title ? state.title.toLowerCase().replace(/\s+/g, "_") : "dream_cookbook"}_manuscript.doc`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to preview the printable PDF layout.");
      return;
    }

    let recipeListHTML = "";
    if (state.recipes.length === 0) {
      recipeListHTML = `<p style="font-style: italic; color: #888;">No recipes drafts written yet. Head back to Module 5 to draft your heirloom favorites!</p>`;
    } else {
      state.recipes.forEach((recipe) => {
        recipeListHTML += `
          <div class="recipe-card" style="page-break-inside: avoid; border: 1px solid #E5E5E5; padding: 25px; border-radius: 12px; margin-bottom: 25px; background: #FFF;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #5B7B61; padding-bottom: 10px; margin-bottom: 15px;">
              <h2 style="font-family: Georgia, serif; margin: 0; color: #2E4A34; font-size: 22px;">${recipe.title}</h2>
              <span style="font-size: 11px; font-weight: bold; background: #EEF5EF; color: #2E4A34; padding: 4px 8px; border-radius: 4px;">${recipe.category || "General"}</span>
            </div>
            <p style="font-style: italic; font-size: 13px; color: #555; margin-bottom: 15px;">${recipe.desc || ""}</p>
            
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #FAF9F6; padding: 10px; border-radius: 8px; font-size: 11px; text-align: center; margin-bottom: 20px;">
              <div><strong>Prep:</strong> ${recipe.prepTime || "N/A"}</div>
              <div><strong>Cook:</strong> ${recipe.cookTime || "N/A"}</div>
              <div><strong>Servings:</strong> ${recipe.servings || "N/A"}</div>
              <div><strong>Difficulty:</strong> ${recipe.difficulty || "Easy"}</div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
              <div>
                <h3 style="font-size: 12px; text-transform: uppercase; color: #5B7B61; margin-bottom: 10px; letter-spacing: 1px;">Ingredients</h3>
                <ul style="padding-left: 15px; margin: 0; font-size: 12px; line-height: 1.8;">
                  ${recipe.ingredients.map(ing => `<li><strong>${ing.amount} ${ing.unit}</strong> ${ing.name}</li>`).join("")}
                </ul>
              </div>
              <div>
                <h3 style="font-size: 12px; text-transform: uppercase; color: #5B7B61; margin-bottom: 10px; letter-spacing: 1px;">Directions</h3>
                <ol style="padding-left: 15px; margin: 0; font-size: 12px; line-height: 1.8;">
                  ${recipe.steps.map(step => `<li style="margin-bottom: 8px;">${step}</li>`).join("")}
                </ol>
              </div>
            </div>
          </div>
        `;
      });
    }

    printWindow.document.write(`
      <html>
      <head>
        <title>${state.title || "Dream Cookbook Workspace"}</title>
        <style>
          body { font-family: 'Inter', system-ui, sans-serif; line-height: 1.6; color: #2F2F2F; padding: 40px; background: #FAF9F6; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          h1 { font-family: Georgia, serif; color: #2E4A34; margin-bottom: 5px; font-size: 32px; font-weight: 900; }
          .subtitle { font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; font-weight: bold; margin-bottom: 30px; border-bottom: 1px solid #EEE; padding-bottom: 15px; }
          h2, h3 { font-family: Georgia, serif; color: #2E4A34; }
          .concept-block { margin-bottom: 40px; padding: 20px; background: #EEF5EF; border-radius: 12px; font-size: 13px; }
          @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; padding: 0; max-width: 100%; }
            .recipe-card { border: none !important; padding: 0 !important; margin-bottom: 40px !important; page-break-after: always; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>${state.title || "My Dream Cookbook"}</h1>
          <div class="subtitle">By ${state.authorName || "An Inspired Self-Publisher"}</div>
          
          <div class="concept-block">
            <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #2E4A34;">My Heirloom Cookbook Concept</h3>
            <p><strong>Primary Audience:</strong> ${state.audience.join(", ")}</p>
            <p><strong>My Author Why:</strong> ${state.motivationText || "To compile, guard, and publish beloved family food traditions."}</p>
            <p><strong>Aesthetic Identity:</strong> ${state.themes.join(", ")}</p>
          </div>

          <h2 style="border-bottom: 2px solid #5B7B61; padding-bottom: 8px; margin-top: 40px;">Finalized Recipe Manuscript</h2>
          ${recipeListHTML}
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

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
      {/* ── DOWNLOAD COOKBOOK WORKSPACE TOOLKIT (AT TOP) ── */}
      <div className="rounded-2xl border border-dashed border-sagedark/45 bg-[#EEF5EF]/55 p-5 space-y-4 shadow-sm font-sans animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-charcoal text-base flex items-center gap-2">
              📥 Export Cookbook Project
            </h4>
            <p className="text-xs text-midgray leading-relaxed">
              Ready to save your dream cookbook? Download your formatted draft data, printing specs, and written recipes in your preferred format.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 text-xs font-bold text-sagedark bg-white hover:bg-[#EEF5EF] border border-lightgray/85 px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              ⚙️ Download .JSON Data
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 text-xs font-bold text-sagedark bg-white hover:bg-[#EEF5EF] border border-lightgray/85 px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              📄 Export PDF Printable
            </button>
            <button
              onClick={handleDownloadDOCX}
              className="flex items-center gap-1.5 text-xs font-bold text-sagedark bg-white hover:bg-[#EEF5EF] border border-lightgray/85 px-3 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              📝 Download DOCX Word
            </button>
          </div>
        </div>
      </div>

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
        <div className="flex flex-col gap-6 max-w-2xl mx-auto animate-fadeIn">
          {/* Inputs Form */}
          <div className="bg-white rounded-2xl border border-lightgray/60 p-6 space-y-5 shadow-sm font-sans">
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
                  className="w-full px-3 py-2 border border-lightgray rounded bg-cream/35 outline-none font-bold text-charcoal font-sans"
                >
                  <option value="color">Full Color Interior</option>
                  <option value="bw">Black &amp; White Interior</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg bg-goldlight/25 border border-gold/30 p-3 text-[11px] leading-relaxed text-charcoal">
              📈 <strong>Price Recommendation:</strong> For physical cookbooks, try listing above $19.99 (B&W) or $29.99 (Color) so you have enough margin to earn back your production costs.
            </div>
          </div>

          {/* Graph Output with Recharts */}
          <div className="bg-white rounded-2xl border border-lightgray/60 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <h4 className="font-serif font-bold text-charcoal text-base">Royalty Income Comparison</h4>
              <p className="text-[11px] text-midgray mt-0.5 leading-normal">
                Estimated earnings you receive per sale after all printing costs and store fees.
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
                <span className="block text-[9px] uppercase font-bold">KDP Standard</span>
                <strong className="block text-lg">${kdpRoy.toFixed(2)}</strong>
              </div>
              <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                <span className="block text-[9px] uppercase font-bold">KDP Kindle eBook</span>
                <strong className="block text-lg">${kindleRoy.toFixed(2)}</strong>
              </div>
              <div className="p-3 bg-gold/10 text-gold rounded-lg">
                <span className="block text-[9px] uppercase font-bold">Etsy Digital</span>
                <strong className="block text-lg">${etsyRoy.toFixed(2)}</strong>
              </div>
            </div>

            {/* Clear Newbie-Friendly Breakdown */}
            <div className="mt-4 rounded-xl bg-cream/35 border border-lightgray/40 p-4 space-y-3 text-xs text-charcoal font-sans">
              <h5 className="font-serif font-bold text-sagedark text-sm">Where does the money go?</h5>
              <div className="grid gap-3 sm:grid-cols-2 text-[11px] leading-relaxed">
                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                  <span className="font-bold text-sagedark block">🛒 Standard Amazon Sale (60% Tier)</span>
                  <div className="flex justify-between text-neutral-600">
                    <span>Retail Price:</span>
                    <span className="font-mono">${price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Amazon Cut (40%):</span>
                    <span className="font-mono">-${(price * 0.4).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Printing Cost ({pages} pages):</span>
                    <span className="font-mono">-${calcKdpCost().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-dashed border-neutral-200 pt-1 flex justify-between font-bold text-charcoal">
                    <span>Your Earnings:</span>
                    <span className="text-sagedark font-mono">${kdpRoy.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                  <span className="font-bold text-blue-600 block">📱 KDP Kindle eBook (70% Tier)</span>
                  <div className="flex justify-between text-neutral-600">
                    <span>eBook Retail Price:</span>
                    <span className="font-mono">${price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Amazon Cut ({price >= 2.99 && price <= 9.99 ? "30%" : "65%"}):</span>
                    <span className="font-mono">-${(price >= 2.99 && price <= 9.99 ? price * 0.30 : price * 0.65).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>eBook Delivery Fee:</span>
                    <span className="font-mono">-${price >= 2.99 && price <= 9.99 ? "0.15" : "0.00"}</span>
                  </div>
                  <div className="border-t border-dashed border-neutral-200 pt-1 flex justify-between font-bold text-charcoal">
                    <span>Your Earnings:</span>
                    <span className="text-blue-600 font-mono">${kindleRoy.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-midgray italic leading-normal border-t border-neutral-200/60 pt-2">
                💡 <strong>eBook Selling Advantage:</strong> eBooks have zero physical printing costs, making them extremely profitable! Amazon offers a premium 70% royalty tier for eBooks priced between $2.99 and $9.99. Setting a price within this sweet spot keeps your cookbook accessible and highly lucrative.
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
