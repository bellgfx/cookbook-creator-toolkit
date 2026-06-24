import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sparkles, Printer, Plus, Trash2, Layout, Sliders, AlertCircle, ShieldAlert, Upload, Download } from "lucide-react";
import { GlobalState, Recipe } from "../types";

interface Module5Props {
  state: GlobalState;
  updateState: (fields: Partial<GlobalState>) => void;
  onNavigate: (module: number) => void;
}

export default function Module5Recipes({ state, updateState, onNavigate }: Module5Props) {
  // We'll manage the active draft recipe locally first, then commit to global state
  const [draft, setDraft] = useState<Recipe>({
    id: Date.now().toString(),
    title: "",
    desc: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "Easy",
    category: "",
    detailLevel: "basic",
    dietTags: state.orderedBadges.map((b) => b.label), // Pre-populate badges from Module 2 by default!
    sectionLabel: "",
    ingredients: [
      { amount: "1", unit: "tbsp", name: "Olive oil", note: "", flagged: false },
      { amount: "2", unit: "lbs", name: "Skinless chicken breasts", note: "or firm organic tofu for vegans", flagged: false }
    ],
    steps: ["Heat olive oil in a skillet over medium heat.", "Sauté the main ingredients for 8-10 minutes until tender."],
    chefTip: "",
    storageNote: "",
    variationNote: "",
    allergyNote: "",
    nutritionNote: "",
    calories: ""
  });

  const [activeCallout, setActiveCallout] = useState<string | null>("tip");

  // Re-sync default dietary tags if they change, but only if draft hasn't been edited drastically
  useEffect(() => {
    if (draft.title === "" && state.orderedBadges.length > 0) {
      setDraft((prev) => ({
        ...prev,
        dietTags: state.orderedBadges.map((b) => b.label)
      }));
    }
  }, [state.orderedBadges]);

  const handleUpdateDraft = (fields: Partial<Recipe>) => {
    const nextDraft = { ...draft, ...fields };
    setDraft(nextDraft);
  };

  const handleAddIngredient = () => {
    setDraft((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { amount: "", unit: "", name: "", note: "", flagged: false }]
    }));
  };

  const handleUpdateIngredient = (index: number, fields: any) => {
    const clone = [...draft.ingredients];
    clone[index] = { ...clone[index], ...fields };
    setDraft((prev) => ({ ...prev, ingredients: clone }));
  };

  const handleRemoveIngredient = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, idx) => idx !== index)
    }));
  };

  const handleAddStep = () => {
    setDraft((prev) => ({ ...prev, steps: [...prev.steps, ""] }));
  };

  const handleUpdateStep = (index: number, value: string) => {
    const nextSteps = [...draft.steps];
    nextSteps[index] = value;
    setDraft((prev) => ({ ...prev, steps: nextSteps }));
  };

  const handleRemoveStep = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, idx) => idx !== index)
    }));
  };

  const handleToggleDietTag = (tagLabel: string) => {
    const exists = draft.dietTags.includes(tagLabel);
    const nextTags = exists
      ? draft.dietTags.filter((t) => t !== tagLabel)
      : [...draft.dietTags, tagLabel];
    setDraft((prev) => ({ ...prev, dietTags: nextTags }));
  };

  const handleCommitRecipe = () => {
    if (!draft.title.trim()) {
      alert("Please provide at least a recipe title before committing.");
      return;
    }
    // Append or replace recipe in global database
    const exists = state.recipes.some((r) => r.id === draft.id);
    let nextRecipes = [];
    if (exists) {
      nextRecipes = state.recipes.map((r) => (r.id === draft.id ? draft : r));
    } else {
      nextRecipes = [...state.recipes, draft];
    }
    updateState({ recipes: nextRecipes });
    alert("Recipe saved successfully to browser local workspace database! ✓");
  };

  const handleSelectPreexisting = (r: Recipe) => {
    setDraft(r);
  };

  const handleDeleteRecipe = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this recipe draft from your workspace?")) {
      const nextRecipes = state.recipes.filter((r) => r.id !== id);
      updateState({ recipes: nextRecipes });
      if (draft.id === id) {
        setDraft({
          id: Date.now().toString(),
          title: "",
          desc: "",
          prepTime: "",
          cookTime: "",
          servings: "",
          difficulty: "Easy",
          category: "",
          detailLevel: "basic",
          dietTags: state.orderedBadges.map((b) => b.label),
          sectionLabel: "",
          ingredients: [{ amount: "", unit: "", name: "", note: "", flagged: false }],
          steps: [""],
          chefTip: "",
          storageNote: "",
          variationNote: "",
          allergyNote: "",
          nutritionNote: "",
          calories: ""
        });
      }
    }
  };

  const handleExportJSON = () => {
    if (state.recipes.length === 0) return;
    
    const exportData = {
      appName: "Cookbook Creator Toolkit",
      companionApp: "https://mycookbook.rlbdesigns.com/",
      version: "1.0",
      exportedAt: new Date().toISOString().split('T')[0],
      recipes: state.recipes
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute(
      "download",
      `cookbook-creator-export-${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        
        let importedRecipes: any[] = [];
        
        if (Array.isArray(parsed)) {
          importedRecipes = parsed;
        } else if (parsed && Array.isArray(parsed.recipes)) {
          importedRecipes = parsed.recipes;
        } else if (parsed && typeof parsed === "object") {
          if (parsed.title) {
            importedRecipes = [parsed];
          } else {
            throw new Error("Invalid JSON structure. Could not find any recipes.");
          }
        } else {
          throw new Error("Invalid JSON file structure.");
        }

        const validRecipes: Recipe[] = importedRecipes
          .filter((r) => r && typeof r === "object" && typeof r.title === "string" && r.title.trim() !== "")
          .map((r, index) => ({
            id: r.id || (Date.now() + index).toString(),
            title: r.title.trim(),
            desc: r.desc || "",
            prepTime: r.prepTime || "",
            cookTime: r.cookTime || "",
            servings: r.servings || "",
            difficulty: r.difficulty || "Easy",
            category: r.category || "",
            detailLevel: r.detailLevel || "basic",
            dietTags: Array.isArray(r.dietTags) ? r.dietTags.filter((t: any) => typeof t === "string") : [],
            sectionLabel: r.sectionLabel || "",
            ingredients: Array.isArray(r.ingredients) 
              ? r.ingredients.map((ing: any) => ({
                  amount: ing.amount || "",
                  unit: ing.unit || "",
                  name: ing.name || "",
                  note: ing.note || "",
                  flagged: !!ing.flagged
                }))
              : [{ amount: "", unit: "", name: "", note: "", flagged: false }],
            steps: Array.isArray(r.steps) ? r.steps.filter((s: any) => typeof s === "string") : [""],
            chefTip: r.chefTip || "",
            storageNote: r.storageNote || "",
            variationNote: r.variationNote || "",
            allergyNote: r.allergyNote || "",
            nutritionNote: r.nutritionNote || "",
            calories: r.calories || ""
          }));

        if (validRecipes.length === 0) {
          alert("No valid recipes found in the uploaded file. Please make sure recipes have a 'title' field.");
          return;
        }

        const mode = confirm(
          `Found ${validRecipes.length} valid recipes in the JSON file!\n\nWould you like to MERGE them with your existing saved recipes? (Click OK)\n\nOr REPLACE all currently saved recipes? (Click Cancel)`
        );

        let nextRecipes = [];
        if (mode) {
          const existingIds = new Set(state.recipes.map((r) => r.id));
          const adjustedImported = validRecipes.map((r) => {
            if (existingIds.has(r.id)) {
              return { ...r, id: `${r.id}-imported-${Math.floor(Math.random() * 1000)}` };
            }
            return r;
          });
          nextRecipes = [...state.recipes, ...adjustedImported];
        } else {
          nextRecipes = validRecipes;
        }

        updateState({ recipes: nextRecipes });
        alert(`Successfully imported ${validRecipes.length} recipes into your Cookbook Creator local workspace! ✓`);
        
        if (validRecipes.length > 0) {
          setDraft(validRecipes[0]);
        }
      } catch (err: any) {
        alert(`Error parsing JSON file: ${err?.message || "Invalid JSON syntax"}`);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleNewRecipe = () => {
    if (confirm("Clear current workspace draft and start a new cookbook page?")) {
      setDraft({
        id: Date.now().toString(),
        title: "",
        desc: "",
        prepTime: "",
        cookTime: "",
        servings: "",
        difficulty: "Easy",
        category: "",
        detailLevel: "basic",
        dietTags: state.orderedBadges.map((b) => b.label),
        sectionLabel: "",
        ingredients: [{ amount: "", unit: "", name: "", note: "", flagged: false }],
        steps: [""],
        chefTip: "",
        storageNote: "",
        variationNote: "",
        allergyNote: "",
        nutritionNote: "",
        calories: ""
      });
    }
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:block">
      {/* Editor Side Form */}
      <div className="space-y-6 print:hidden">
        {/* Header Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-charcoal">Recipe Interior Card Builder</h3>
            <p className="text-xs text-midgray mt-0.5">
              Draft your custom cards with live formatting before exporting.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleNewRecipe}
              className="rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-charcoal px-3 py-1.5 text-xs font-bold"
            >
              ↺ Start New
            </button>
            <button
              onClick={handleCommitRecipe}
              className="rounded-lg bg-sagedark hover:bg-sage text-white px-3.5 py-1.5 text-xs font-bold shadow-sm"
            >
              ✓ Save Progress
            </button>
          </div>
        </div>

        {/* Saved Recipes Shelf */}
        {state.recipes.length > 0 && (
          <div className="rounded-xl border border-lightgray/55 bg-cream/30 p-4 space-y-2">
            <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
              Load Saved Drafts ({state.recipes.length})
            </span>
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {state.recipes.map((r) => (
                <div key={r.id} className="relative flex items-center group/draft flex-shrink-0">
                  <button
                    onClick={() => handleSelectPreexisting(r)}
                    className={`pl-3 pr-8 py-1.5 rounded-lg border text-xs font-bold transition-all whitespace-nowrap ${
                      draft.id === r.id
                        ? "bg-sagedark border-sagedark text-white"
                        : "bg-white border-lightgray text-charcoal hover:bg-neutral-100"
                    }`}
                  >
                    {r.title || "Untitled Draft"}
                  </button>
                  <button
                    onClick={(e) => handleDeleteRecipe(r.id, e)}
                    className={`absolute right-1.5 p-1 rounded transition-colors cursor-pointer ${
                      draft.id === r.id 
                        ? "text-white/70 hover:bg-white/25 hover:text-white" 
                        : "text-midgray hover:bg-red-50 hover:text-red-600"
                    }`}
                    title="Delete this saved draft"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JSON Import/Export Integration Toolkit */}
        <div className="rounded-2xl border border-dashed border-sagelight/80 bg-mentor-bg/50 p-5 space-y-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sage/10 text-sagedark flex-shrink-0 mt-0.5">
              <Upload className="h-4.5 w-4.5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-charcoal text-sm">
                "My Cookbook" App Integration (.JSON)
              </h4>
              <p className="text-xs text-midgray leading-relaxed">
                Connect your recipes from your companion app{" "}
                <a 
                  href="https://mycookbook.rlbdesigns.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sagedark font-bold underline hover:text-sage"
                >
                  mycookbook.rlbdesigns.com
                </a>! 
                Upload your saved JSON cookbook backup file to instantly populate your workspace, or export your current drafts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <input
              type="file"
              id="cookbook-json-upload"
              accept=".json"
              className="hidden"
              onChange={handleImportJSON}
            />
            
            <button
              onClick={() => document.getElementById("cookbook-json-upload")?.click()}
              className="flex items-center gap-2 rounded-lg bg-white border border-lightgray hover:border-sagedark text-charcoal hover:text-sagedark px-3.5 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Upload className="h-4 w-4 text-sagedark" />
              Import Recipes File (.json)
            </button>

            <button
              onClick={handleExportJSON}
              disabled={state.recipes.length === 0}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold shadow-sm transition-all ${
                state.recipes.length === 0
                  ? "bg-neutral-50 border border-neutral-200 text-neutral-400 cursor-not-allowed"
                  : "bg-white border border-lightgray hover:border-sagedark text-charcoal hover:text-sagedark cursor-pointer"
              }`}
              title={state.recipes.length === 0 ? "Save some recipes first to export them" : "Download your recipe backups"}
            >
              <Download className="h-4 w-4 text-sagedark" />
              Export Recipes ({state.recipes.length})
            </button>
            
            <button
              onClick={() => alert(`Best Schema Format for "My Cookbook" Integration:\n\nProvide a JSON file containing either an array of recipes or a wrapper object:\n\n{\n  "recipes": [\n    {\n      "title": "Recipe Title",\n      "desc": "A short description",\n      "prepTime": "15 mins",\n      "cookTime": "30 mins",\n      "servings": "4",\n      "difficulty": "Easy",\n      "category": "Dinner",\n      "dietTags": ["Gluten-Free", "Nut-Free"],\n      "ingredients": [{ "amount": "1", "unit": "cup", "name": "Rice" }],\n      "steps": ["Step 1 directions...", "Step 2 directions..."]\n    }\n  ]\n}`)}
              className="text-xs text-sagedark font-bold hover:underline cursor-pointer py-1.5 px-2 hover:bg-[#EEF5EF] rounded-lg transition-colors"
            >
              View JSON Schema Guide 📋
            </button>
          </div>
        </div>

        {/* Step 1: Detail Levels & Badges */}
        <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-4 shadow-sm">
          <label className="text-xs font-bold text-sagedark uppercase tracking-wider block">
            Workspace Detail Model
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "basic", label: "🥄 Basic", desc: "No formatting margins" },
              { id: "detailed", label: "📋 Detailed", desc: "Allows units & substitutions" },
              { id: "full", label: "⚕️ AGS / Allergy", desc: "Individual safety flags" }
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => handleUpdateDraft({ detailLevel: lvl.id as any })}
                className={`p-3 rounded-xl border text-center transition-all ${
                  draft.detailLevel === lvl.id
                    ? "bg-[#EEF5EF] border-sagedark ring-2 ring-sagedark/15"
                    : "bg-cream/40 border-lightgray hover:bg-[#EEF5EF]"
                }`}
              >
                <span className="block font-bold text-xs text-charcoal leading-none mt-1">{lvl.label}</span>
                <span className="block text-[9px] text-midgray mt-1 leading-normal">{lvl.desc}</span>
              </button>
            ))}
          </div>

          {/* Badges Overlay Selection Override */}
          <div className="pt-2">
            <span className="text-xs font-bold text-sagedark uppercase tracking-wider block mb-2">
              Exclude or Include Tags Specifically for this Page
            </span>
            <div className="flex flex-wrap gap-1.5">
              {state.orderedBadges.map((b) => {
                const isActive = draft.dietTags.includes(b.label);
                return (
                  <button
                    key={b.label}
                    onClick={() => handleToggleDietTag(b.label)}
                    className={`px-2.5 py-1 rounded-full border text-[10px] font-bold transition-all ${
                      isActive
                        ? b.type === "ags"
                          ? "bg-terracotta border-terracotta text-white"
                          : "bg-sagedark border-sagedark text-white"
                        : "bg-cream border-lightgray text-midgray/60"
                    }`}
                  >
                    {isActive ? "✓ " : "+ "} {b.label}
                  </button>
                );
              })}
            </div>
            {state.orderedBadges.length === 0 && (
              <span className="text-[10px] text-midgray/50 italic block leading-relaxed">
                No active badges configured in Module 2 yet. These can still be edited manually later!
              </span>
            )}
          </div>
        </div>

        {/* Step 2: Recipe Basics */}
        <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-4 shadow-sm">
          <h4 className="font-serif font-bold text-charcoal text-base">Key Metrics</h4>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                Recipe Title
              </label>
              <input
                type="text"
                className="w-full px-3.5 py-2.5 rounded-lg border-2 border-lightgray focus:border-sage outline-none text-xs bg-cream/30 text-charcoal font-semibold"
                placeholder="e.g. Garden Harvest Zucchini Stew with Sautéed Shallots"
                value={draft.title}
                onChange={(e) => handleUpdateDraft({ title: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                Description / Blurb Intro
              </label>
              <textarea
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-lg border-2 border-lightgray focus:border-sage outline-none text-xs bg-cream/30 text-charcoal"
                placeholder="Comforting, savory soup perfectly safe for lone star tick food reactions and soothing post-chemotherapy treatments..."
                value={draft.desc}
                onChange={(e) => handleUpdateDraft({ desc: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-sagedark uppercase tracking-wider block">
                  Prep Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 min"
                  value={draft.prepTime}
                  onChange={(e) => handleUpdateDraft({ prepTime: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-lightgray text-xs bg-cream/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-sagedark uppercase tracking-wider block">
                  Cook Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. 35 min"
                  value={draft.cookTime}
                  onChange={(e) => handleUpdateDraft({ cookTime: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-lightgray text-xs bg-cream/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-sagedark uppercase tracking-wider block">
                  Servings
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4-6"
                  value={draft.servings}
                  onChange={(e) => handleUpdateDraft({ servings: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-lightgray text-xs bg-cream/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-sagedark uppercase tracking-wider block">
                  Difficulty
                </label>
                <select
                  value={draft.difficulty}
                  onChange={(e) => handleUpdateDraft({ difficulty: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-lightgray text-xs bg-cream/30"
                >
                  <option>Easy</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <label className="text-[9px] font-bold text-sagedark uppercase tracking-wider block">
                  Calories
                </label>
                <input
                  type="text"
                  placeholder="e.g. 320 kcal"
                  value={draft.calories || ""}
                  onChange={(e) => handleUpdateDraft({ calories: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-lightgray text-xs bg-cream/30 font-medium text-charcoal"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                  Section Label / Chapter
                </label>
                <input
                  type="text"
                  placeholder="e.g. Soups &amp; Starters, Desserts..."
                  value={draft.category}
                  onChange={(e) => handleUpdateDraft({ category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-lightgray text-xs bg-cream/30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                  Custom Gutter Separator Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 'For the Sauce', 'For the coating'"
                  value={draft.sectionLabel}
                  onChange={(e) => handleUpdateDraft({ sectionLabel: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-lightgray text-xs bg-cream/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Ingredients */}
        <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-charcoal text-base">Ingredients Specification</h4>
            <button
              onClick={handleAddIngredient}
              className="rounded-lg bg-sagedark hover:bg-sage text-white px-3 py-1 font-bold text-xs"
            >
              + Add Row
            </button>
          </div>

          <div className="space-y-2">
            {draft.ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2 items-center bg-cream/20 border border-lightgray/55 rounded-lg p-3">
                {/* Amount input */}
                <input
                  type="text"
                  placeholder="Amt"
                  className="w-16 px-2 py-1.5 border border-lightgray rounded text-xs outline-none bg-white text-center"
                  value={ing.amount}
                  onChange={(e) => handleUpdateIngredient(index, { amount: e.target.value })}
                />

                {/* Unit (Detailed or Full) */}
                {draft.detailLevel !== "basic" && (
                  <input
                    type="text"
                    placeholder="Unit"
                    className="w-16 px-2 py-1.5 border border-lightgray rounded text-xs outline-none bg-white text-center"
                    value={ing.unit}
                    onChange={(e) => handleUpdateIngredient(index, { unit: e.target.value })}
                  />
                )}

                {/* Name */}
                <input
                  type="text"
                  placeholder="Ingredient name"
                  className="flex-1 px-2.5 py-1.5 border border-lightgray rounded text-xs outline-none bg-white font-semibold"
                  value={ing.name}
                  onChange={(e) => handleUpdateIngredient(index, { name: e.target.value })}
                />

                {/* Notes/Subs (Detailed/Full) */}
                {draft.detailLevel !== "basic" && (
                  <input
                    type="text"
                    placeholder="Prep notes or substitution swaps"
                    className="flex-1 px-3 py-1.5 border border-lightgray rounded text-xs outline-none bg-white text-midgray italic"
                    value={ing.note}
                    onChange={(e) => handleUpdateIngredient(index, { note: e.target.value })}
                  />
                )}

                {/* Allergy warning flag (Full Level Only) */}
                {draft.detailLevel === "full" && (
                  <button
                    onClick={() => handleUpdateIngredient(index, { flagged: !ing.flagged })}
                    className={`px-2.5 py-1.5 text-[9px] font-bold rounded-lg border-2 transition-all ${
                      ing.flagged ? "bg-red-500 border-red-500 text-white" : "border-neutral-300 text-midgray hover:border-red-400"
                    }`}
                  >
                    {ing.flagged ? "⚠️ FLAGGED" : "Safe"}
                  </button>
                )}

                <button
                  onClick={() => handleRemoveIngredient(index)}
                  className="text-neutral-400 hover:text-red-600 p-1 flex-shrink-0"
                  title="Remove Ingredient"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: Instruction steps */}
        <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-charcoal text-base">Step Instructions</h4>
            <button
              onClick={handleAddStep}
              className="rounded-lg bg-sagedark hover:bg-sage text-white px-3 py-1 font-bold text-xs"
            >
              + Add step
            </button>
          </div>

          <div className="space-y-3">
            {draft.steps.map((s, index) => (
              <div key={index} className="flex gap-3 items-start">
                <span className="h-6 w-6 rounded-full bg-sagedark text-white font-bold flex items-center justify-center text-xs flex-shrink-0 mt-2">
                  {index + 1}
                </span>

                <textarea
                  className="flex-1 px-3 py-2 border border-lightgray rounded-lg outline-none text-xs bg-cream/25 focus:border-sage"
                  rows={2}
                  placeholder={`Describe preparation sequence ${index + 1}...`}
                  value={s}
                  onChange={(e) => handleUpdateStep(index, e.target.value)}
                />

                <button
                  onClick={() => handleRemoveStep(index)}
                  className="text-neutral-400 hover:text-red-500 mt-3 flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Step 5: Callout Collapsible Extras */}
        <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-4 shadow-sm">
          <h4 className="font-serif font-bold text-charcoal text-base">Add Callout Boxes</h4>

          <div className="flex border-b border-lightgray/40 text-xs">
            {["tip", "storage", "allergy", "nutrition"].map((key) => (
              <button
                key={key}
                onClick={() => setActiveCallout(key)}
                className={`flex-1 text-center py-2 font-bold tracking-wider uppercase border-b-2 transition-colors ${
                  activeCallout === key ? "border-gold text-gold" : "border-transparent text-midgray hover:text-charcoal"
                }`}
              >
                {key === "tip" && "💡 Chef Tip"}
                {key === "storage" && "🫙 Storage"}
                {key === "allergy" && "⚠️ Safety"}
                {key === "nutrition" && "📊 Nutrition"}
              </button>
            ))}
          </div>

          <div>
            {activeCallout === "tip" && (
              <textarea
                value={draft.chefTip}
                onChange={(e) => handleUpdateDraft({ chefTip: e.target.value })}
                rows={3}
                className="w-full text-xs px-3.5 py-2.5 border border-lightgray rounded-lg outline-none"
                placeholder="e.g. Always sauté the garlic on gentle heat; burning causes extreme bitterness in light vegetable broths..."
              />
            )}
            {activeCallout === "storage" && (
              <textarea
                value={draft.storageNote}
                onChange={(e) => handleUpdateDraft({ storageNote: e.target.value })}
                rows={3}
                className="w-full text-xs px-3.5 py-2.5 border border-lightgray rounded-lg outline-none"
                placeholder="e.g. Keep in glass hermetic jars in the fridge for up to 4 days, or freeze in silicone cups for up to 3 months..."
              />
            )}
            {activeCallout === "allergy" && (
              <textarea
                value={draft.allergyNote}
                onChange={(e) => handleUpdateDraft({ allergyNote: e.target.value })}
                rows={3}
                className="w-full text-xs px-3.5 py-2.5 border border-red-300 rounded-lg outline-none bg-red-50/20"
                placeholder="e.g. Alpha-Gal Caution: Verify vegetable broth doesn't contain hidden beef gelatin stabilizers on industrial labels..."
              />
            )}
            {activeCallout === "nutrition" && (
              <textarea
                value={draft.nutritionNote}
                onChange={(e) => handleUpdateDraft({ nutritionNote: e.target.value })}
                rows={3}
                className="w-full text-xs px-3.5 py-2.5 border border-lightgray rounded-lg outline-none"
                placeholder="e.g. Cal: 220kcal | Prot: 25g | Net Carbs: 5g | Fats: 12g per generous portion..."
              />
            )}
          </div>
        </div>
      </div>

      {/* Real-time Widget Preview Side Panel */}
      <div className="flex flex-col justify-start print:block max-w-3xl mx-auto w-full">
        <div className="p-3 border-b border-lightgray/55 flex items-center justify-between bg-white rounded-t-2xl border-t border-x border-lightgray/60 shadow-sm print:hidden">
          <span className="flex items-center gap-1.5">
            <span className="live-dot" />
            <h4 className="text-[10px] font-bold text-midgray uppercase tracking-widest">
              Live card interior format
            </h4>
          </span>

          <button
            onClick={handleTriggerPrint}
            className="flex items-center gap-1 bg-sagedark hover:bg-sage text-white text-[10px] px-2.5 py-1 rounded font-bold"
          >
            <Printer className="h-3 w-3" /> Print Card
          </button>
        </div>

        {/* Printable/Preview Frame */}
        <div className="bg-white rounded-b-2xl border-x border-b border-lightgray/60 p-6 flex-1 shadow-sm md:sticky md:top-4 print:border-none print:shadow-none print:bg-white print:p-0">
          <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm bg-white p-6 space-y-6">
            <div className="bg-sagedark text-cream p-4 rounded-xl space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {draft.dietTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[8px] bg-white/20 border border-white/10 text-white font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h4 className="font-serif text-xl font-bold leading-tight drop-shadow-sm">
                {draft.title || "Untitled Card interior"}
              </h4>
              {draft.desc && <p className="text-xs text-cream/80 italic leading-relaxed">{draft.desc}</p>}

              <div className="flex gap-4 pt-1 flex-wrap text-neutral-50 text-[11px]">
                {draft.prepTime && (
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-cream/55">Prep</span>
                    <strong className="font-bold">{draft.prepTime}</strong>
                  </div>
                )}
                {draft.cookTime && (
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-cream/55">Cook</span>
                    <strong className="font-bold">{draft.cookTime}</strong>
                  </div>
                )}
                {draft.servings && (
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-cream/55">Servings</span>
                    <strong className="font-bold">{draft.servings}</strong>
                  </div>
                )}
                {draft.difficulty && (
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-cream/55">Level</span>
                    <strong className="font-bold">{draft.difficulty}</strong>
                  </div>
                )}
                {draft.calories && (
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider text-cream/55">Calories</span>
                    <strong className="font-bold text-gold">{draft.calories}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients Category list */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-sagedark block uppercase tracking-wider border-b-2 border-sagelight/40 pb-1">
                {draft.category || "Ingredients"}
              </span>

              {draft.sectionLabel && (
                <span className="text-[11px] font-serif font-bold text-terracottadark italic block">
                  {draft.sectionLabel}
                </span>
              )}

              <div className="space-y-1.5 text-xs text-charcoal/90">
                {draft.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-start gap-2 border-b border-lightgray/10 pb-1.5">
                    <div className="h-3.5 w-3.5 border border-sage rounded-sm flex-shrink-0 mt-0.5" />
                    
                    <div className="flex-1 grid grid-cols-12 gap-1">
                      <span className="col-span-3 font-bold text-sagedark text-right pr-2 truncate">
                        {ing.amount} {draft.detailLevel !== "basic" && ing.unit}
                      </span>
                      <div className="col-span-9">
                        <span className="font-medium text-charcoal">{ing.name}</span>
                        {draft.detailLevel !== "basic" && ing.note && (
                          <span className="block text-[10px] text-midgray italic">
                            ({ing.note})
                          </span>
                        )}
                      </div>
                    </div>

                    {ing.flagged && draft.detailLevel === "full" && (
                      <span className="rounded bg-red-500 text-white font-bold px-1.5 py-0.5 text-[8px] flex-shrink-0">
                        ⚠️ WARNING
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Sequence list */}
            {draft.steps.length > 0 && draft.steps[0] !== "" && (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-sagedark block uppercase tracking-wider border-b-2 border-sagelight/40 pb-1">
                  Preparation sequence
                </span>

                <div className="space-y-3 text-xs leading-relaxed text-charcoal/85">
                  {draft.steps.map((st, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="h-5 w-5 rounded-full bg-sagedark text-cream font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Callouts output pane */}
            {(draft.chefTip || draft.storageNote || draft.allergyNote || draft.nutritionNote) && (
              <div className="space-y-2 border-t border-lightgray/40 pt-4">
                {draft.chefTip && (
                  <div className="rounded-lg bg-goldlight/30 border-l-4 border-gold p-3 text-[11px] leading-relaxed text-charcoal">
                    <strong className="block text-gold text-[9px] uppercase tracking-wider mb-0.5">💡 Chef Tip</strong>
                    {draft.chefTip}
                  </div>
                )}
                {draft.storageNote && (
                  <div className="rounded-lg bg-neutral-100 border-l-4 border-neutral-400 p-3 text-[11px] leading-relaxed text-charcoal">
                    <strong className="block text-[#4A4A4A] text-[9px] uppercase tracking-wider mb-0.5">🫙 Storage</strong>
                    {draft.storageNote}
                  </div>
                )}
                {draft.allergyNote && (
                  <div className="rounded-lg bg-red-50/50 border-l-4 border-red-500 p-3 text-[11px] leading-relaxed text-red-700 font-medium">
                    <strong className="block text-red-600 text-[9px] uppercase tracking-wider mb-0.5">⚠️ safety alert</strong>
                    {draft.allergyNote}
                  </div>
                )}
                {draft.nutritionNote && (
                  <div className="rounded-lg bg-neutral-50 p-3 text-[11px] leading-relaxed text-neutral-500 font-mono">
                    <strong className="block text-neutral-600 text-[9px] font-sans uppercase tracking-wider mb-0.5">📊 Nutrition parameters</strong>
                    {draft.nutritionNote}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action navigation tabs */}
        <div className="pt-6 border-t border-lightgray/40 flex justify-between print:hidden">
          <button
            onClick={() => onNavigate(4)}
            className="rounded-lg border-2 border-lightgray hover:border-charcoal bg-white text-midgray hover:text-charcoal px-4 py-2 text-xs font-bold transition-all"
          >
            ← Back to Canva Guides
          </button>
          <button
            onClick={() => onNavigate(6)}
            className="rounded-lg bg-terracotta hover:bg-terracottadark text-white px-5 py-2.5 text-xs font-bold shadow-sm transition-all"
          >
            Proceed to Publishing Economics 📚
          </button>
        </div>
      </div>
    </div>
  );
}
