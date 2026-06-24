import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Palette, 
  Type, 
  Sparkles, 
  BookOpen, 
  Download, 
  RotateCw, 
  Info, 
  Printer, 
  HelpCircle,
  FolderHeart,
  ChevronRight,
  RefreshCw,
  Scale
} from "lucide-react";
import { GlobalState } from "../types";

interface CoverStudioProps {
  state: GlobalState;
  updateState: (fields: Partial<GlobalState>) => void;
}

const PALETTES = [
  { id: "sage-forest", name: "Sage Mist & Pine", primary: "#4A6B4E", secondary: "#EFF5EC", text: "#FAF7F2", accent: "#C4714A" },
  { id: "terracotta-clay", name: "Terracotta Hearth", primary: "#C4714A", secondary: "#FAF2EE", text: "#2C1810", accent: "#7B5E3A" },
  { id: "charcoal-slate", name: "Sleek Slate & Steel", primary: "#2C2C2C", secondary: "#F2F2F0", text: "#FFFFFF", accent: "#1A6B4A" },
  { id: "golden-harvest", name: "Autumn Barley & Gold", primary: "#D4AF37", secondary: "#FAF7EE", text: "#4A3728", accent: "#7B5E3A" },
  { id: "rustic-parchment", name: "Vintage Cream & Kraft", primary: "#7B5E3A", secondary: "#FAF6EE", text: "#2C1810", accent: "#C9A87C" },
];

const FONTS = [
  { id: "playfair", name: "Playfair Display & Lato", titleClass: "font-serif font-bold tracking-tight", bodyClass: "font-sans uppercase tracking-widest text-[10px]" },
  { id: "cinzel", name: "Cinzel & Inter", titleClass: "font-serif tracking-widest uppercase", bodyClass: "font-sans tracking-wide text-[11px]" },
  { id: "oswald", name: "Oswald Bold & Roboto", titleClass: "font-sans font-black tracking-normal uppercase", bodyClass: "font-sans tracking-wider text-[11px]" },
  { id: "lora", name: "Lora & Space Grotesk", titleClass: "font-serif font-medium tracking-tight italic", bodyClass: "font-sans tracking-wide font-medium text-[10px]" },
];

const TEMPLATES = [
  { id: "editorial-minimal", name: "Editorial Elegant", desc: "Clean borders, prominent author block, focused graphic frame." },
  { id: "vintage-badge", name: "Artesian Heritage Seal", desc: "Double-ringed central seal with ribbon details and culinary icons." },
  { id: "split-modern", name: "Split-Panel Colorblock", desc: "Bold dual-tone color contrast layout with modern side typography." },
  { id: "botanical-border", name: "Organic Vine & Leaf", desc: "Natural leaf framing with a soft, clean floating card block." },
];

const BACKGROUND_PATTERNS = [
  { id: "solid", name: "Solid Velvet Base", css: "bg-current" },
  { id: "linen", name: "Woven Linen Texture", css: "bg-[radial-gradient(#ffffff15_1px,transparent_1px)] bg-[size:16px_16px]" },
  { id: "grid", name: "Architectural Culinary Grid", css: "bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" },
  { id: "dots", name: "Modernist Confetti Polka", css: "bg-[radial-gradient(#ffffff20_1px,transparent_1px)] bg-[size:8px_8px]" },
];

const ICONS = [
  { id: "leaf", label: "🌿 Organic Sprout", svg: (
    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18c-3.333 0-6 2.667-6 6s2.667 6 6 6m0-12c3.333 0 6 2.667 6 6s-2.667 6-6 6m-6-6h12" />
    </svg>
  )},
  { id: "utensils", label: "🍴 Fork & Spoon", svg: (
    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 002-2V8a2 2 0 00-4 0v4a2 2 0 002 2zm10 0a2 2 0 002-2v-4a2 2 0 00-4 0v4a2 2 0 002 2zM12 11v9" />
    </svg>
  )},
  { id: "heart", label: "💖 Healing Heart", svg: (
    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )},
  { id: "chef", label: "🧑‍🍳 Chef's Hat", svg: (
    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.244 20h.01M9.756 20h.01M12 14c2.5 0 4-1.5 4-3s-1-2.5-1-4a3 3 0 10-6 0c0 1.5-1 2.5-1 4s1.5 3 4 3z" />
    </svg>
  )},
];

export default function CoverStudio({ state, updateState }: CoverStudioProps) {
  // Sync state values or fallback to default structures
  const [title, setTitle] = useState(state.coverTitle || state.title || "The Healing Kitchen");
  const [subtitle, setSubtitle] = useState(state.coverSubtitle || state.audienceText || "Wholesome & Allergen-Safe Recipes for Families");
  const [author, setAuthor] = useState(state.coverAuthor || state.authorName || "Chef Evelyn Brooks");
  
  const [template, setTemplate] = useState(state.coverTemplate || "editorial-minimal");
  const [paletteId, setPaletteId] = useState(state.coverPrimaryColor || "sage-forest");
  const [fontId, setFontId] = useState(state.coverFontPairing || "playfair");
  const [patternId, setPatternId] = useState(state.coverBackground || "linen");
  const [iconId, setIconId] = useState(state.coverIconType || "leaf");
  const [pages, setPages] = useState(state.coverPageCount || 120);

  const [previewMode, setPreviewMode] = useState<"2d" | "3d">("3d");
  const [rotation, setRotation] = useState(-18);

  // Auto-sync custom settings back to parent state
  useEffect(() => {
    updateState({
      coverTitle: title,
      coverSubtitle: subtitle,
      coverAuthor: author,
      coverTemplate: template,
      coverBackground: patternId,
      coverPrimaryColor: paletteId,
      coverFontPairing: fontId,
      coverIconType: iconId,
      coverPageCount: pages
    });
  }, [title, subtitle, author, template, paletteId, fontId, patternId, iconId, pages]);

  const activePalette = PALETTES.find((p) => p.id === paletteId) || PALETTES[0];
  const activeFont = FONTS.find((f) => f.id === fontId) || FONTS[0];
  const activePattern = BACKGROUND_PATTERNS.find((pt) => pt.id === patternId) || BACKGROUND_PATTERNS[0];
  const activeIcon = ICONS.find((i) => i.id === iconId) || ICONS[0];

  // Calculate specifications for Amazon KDP Paperback Cover design
  // Standard KDP trim is 6 x 9 inches. 
  // Bleed is 0.125" on top, bottom, and outside edges.
  // Spine width calculation based on 120 pages (approx. 0.25 inches thick for cream paper)
  const calculateKdpSpecs = () => {
    const isCream = true; // Default cream
    const pageThickness = isCream ? 0.0025 : 0.00225;
    const spineWidth = parseFloat((pages * pageThickness).toFixed(4));
    
    // Total Cover Width = 0.125 (left bleed) + 6 (back cover) + spineWidth + 6 (front cover) + 0.125 (right bleed)
    const totalWidthInches = parseFloat((12.25 + spineWidth).toFixed(4));
    const totalHeightInches = 9.25; // 9" height + 0.125" top bleed + 0.125" bottom bleed

    return {
      spineWidth,
      totalWidthInches,
      totalHeightInches,
      spineWidthMm: (spineWidth * 25.4).toFixed(1),
      totalWidthMm: (totalWidthInches * 25.4).toFixed(1),
      totalHeightMm: (totalHeightInches * 25.4).toFixed(1)
    };
  };

  const specs = calculateKdpSpecs();

  const handleRandomize = () => {
    const randomTemplate = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)].id;
    const randomPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)].id;
    const randomFont = FONTS[Math.floor(Math.random() * FONTS.length)].id;
    const randomPattern = BACKGROUND_PATTERNS[Math.floor(Math.random() * BACKGROUND_PATTERNS.length)].id;
    const randomIcon = ICONS[Math.floor(Math.random() * ICONS.length)].id;

    setTemplate(randomTemplate);
    setPaletteId(randomPalette);
    setFontId(randomFont);
    setPatternId(randomPattern);
    setIconId(randomIcon);
  };

  return (
    <div className="space-y-8">
      {/* Intro block */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-cream/35 border border-lightgray/50 rounded-2xl p-5">
        <div className="space-y-1 max-w-xl">
          <span className="text-[10px] bg-terracotta/10 text-terracotta border border-terracotta/20 px-2.5 py-0.5 rounded uppercase font-bold tracking-widest inline-block">
            Professional Design Studio
          </span>
          <h3 className="font-serif text-2xl font-bold text-charcoal">Cookbook Cover Creator</h3>
          <p className="text-xs text-midgray leading-relaxed">
            Covers act as your primary sales magnet. Choose a custom preset layout, toggle rich textures, and visualize your book in full 3D rotatable perspective before printing or uploading to Amazon KDP.
          </p>
        </div>

        <button
          onClick={handleRandomize}
          className="flex items-center gap-1.5 bg-white border border-lightgray hover:border-gold hover:text-gold text-charcoal text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <RefreshCw className="h-4.5 w-4.5" /> Inspiring Randomizer
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Side: Customize Form Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Metadata Section */}
          <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-4 shadow-sm">
            <h4 className="font-serif text-base font-bold text-charcoal flex items-center gap-2">
              <Type className="h-4.5 w-4.5 text-terracotta" /> Text & Content Customizer
            </h4>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                  Main Book Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-lightgray focus:border-sage outline-none rounded-lg text-xs font-serif font-bold text-charcoal"
                  placeholder="e.g. Purely Wholesome"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                  Subtitle or Selling Angle Hook
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-lightgray focus:border-sage outline-none rounded-lg text-xs font-medium text-charcoal"
                  placeholder="e.g. Delicious AGS-Safe Meals For Vibrant Longevity"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-lightgray focus:border-sage outline-none rounded-lg text-xs font-medium text-charcoal"
                  placeholder="e.g. Evelyn Brooks, CNS"
                />
              </div>
            </div>
          </div>

          {/* Template Layout Selection */}
          <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-4 shadow-sm">
            <h4 className="font-serif text-base font-bold text-charcoal flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-sagedark" /> Layout Style Preset
            </h4>

            <div className="grid gap-3 grid-cols-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setTemplate(tpl.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    template === tpl.id 
                      ? "border-sagedark bg-[#EEF5EF] ring-2 ring-sagedark/15" 
                      : "border-lightgray hover:bg-neutral-50 bg-white"
                  }`}
                >
                  <strong className="block text-xs text-charcoal">{tpl.name}</strong>
                  <span className="block text-[10px] text-midgray mt-1 leading-relaxed">
                    {tpl.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-4 shadow-sm">
            <h4 className="font-serif text-base font-bold text-charcoal flex items-center gap-2">
              <Palette className="h-4.5 w-4.5 text-gold" /> Editorial Color Scheme
            </h4>

            <div className="space-y-2">
              {PALETTES.map((pal) => (
                <button
                  key={pal.id}
                  onClick={() => setPaletteId(pal.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                    paletteId === pal.id 
                      ? "border-sagedark bg-[#EEF5EF] ring-2 ring-sagedark/10" 
                      : "border-lightgray hover:bg-neutral-50 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1.5">
                      <div className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: pal.primary }} />
                      <div className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: pal.secondary }} />
                      <div className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: pal.accent }} />
                    </div>
                    <span className="text-xs font-bold text-charcoal">{pal.name}</span>
                  </div>
                  
                  {paletteId === pal.id && <span className="text-sagedark font-bold text-xs">Active ✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Typography & Patterns Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            
            {/* Fonts */}
            <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-3 shadow-sm">
              <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                Typeface Spec
              </span>
              <div className="space-y-1.5">
                {FONTS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFontId(f.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold ${
                      fontId === f.id 
                        ? "border-sagedark bg-[#EEF5EF]" 
                        : "border-lightgray hover:bg-neutral-50 bg-white"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Backdrop */}
            <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-3 shadow-sm">
              <span className="text-[10px] font-bold text-sagedark uppercase tracking-wider block">
                Parchment Pattern
              </span>
              <div className="space-y-1.5">
                {BACKGROUND_PATTERNS.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setPatternId(pt.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-semibold ${
                      patternId === pt.id 
                        ? "border-sagedark bg-[#EEF5EF]" 
                        : "border-lightgray hover:bg-neutral-50 bg-white"
                    }`}
                  >
                    {pt.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Icons Selection */}
          <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-4 shadow-sm">
            <h4 className="font-serif text-base font-bold text-charcoal">
              Cover Accent Engraving Icon
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic.id}
                  onClick={() => setIconId(ic.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    iconId === ic.id
                      ? "border-sagedark bg-[#EEF5EF] ring-2 ring-sagedark/15"
                      : "border-lightgray bg-white hover:bg-neutral-50"
                  }`}
                >
                  <div className="text-sagedark opacity-85">
                    {ic.svg}
                  </div>
                  <span className="text-[9px] font-bold text-midgray mt-1 block truncate w-full text-center">
                    {ic.label.split(" ")[1]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* KDP Spine Calculator specifications */}
          <div className="rounded-2xl border border-[#C4714A]/30 bg-[#FAF2EE] p-5 space-y-4 shadow-sm">
            <h4 className="font-serif text-base font-bold text-terracottadark flex items-center gap-1.5">
              <Scale className="h-4.5 w-4.5" /> Amazon KDP Paperback Spine Dimension
            </h4>

            <div className="space-y-3 text-xs leading-relaxed text-charcoal/85">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold text-midgray">Page Count Estimate:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="24"
                    max="600"
                    value={pages}
                    onChange={(e) => setPages(Math.max(24, parseInt(e.target.value) || 24))}
                    className="w-16 text-center py-1 border border-lightgray bg-white text-xs font-bold rounded"
                  />
                  <span className="text-midgray font-bold">pages</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-white/60 p-3 rounded-lg border border-[#C4714A]/10 text-center font-mono text-[11px] text-charcoal">
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-midgray font-sans mb-1">Spine Width</span>
                  <strong>{specs.spineWidth}"</strong>
                  <span className="block text-[9px] text-midgray/70">({specs.spineWidthMm}mm)</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-midgray font-sans mb-1">KDP Cover Width</span>
                  <strong>{specs.totalWidthInches}"</strong>
                  <span className="block text-[9px] text-midgray/70">({specs.totalWidthMm}mm)</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase tracking-wider text-midgray font-sans mb-1">KDP Cover Height</span>
                  <strong>{specs.totalHeightInches}"</strong>
                  <span className="block text-[9px] text-midgray/70">({specs.totalHeightMm}mm)</span>
                </div>
              </div>

              <div className="rounded-lg bg-white/40 p-2.5 text-[10px] leading-relaxed text-midgray/80 flex items-start gap-2">
                <Info className="h-4 w-4 text-terracotta flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Tip:</strong> Amazon KDP paperback requires a single composite file containing both the Back Cover, Spine, and Front Cover in one canvas. Use these calculated dimensions as your Canva page resolution!
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Mockup Stage */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Controls bar */}
          <div className="bg-white rounded-xl border border-lightgray/55 p-3 flex items-center justify-between shadow-sm">
            <span className="text-xs font-bold text-sagedark uppercase tracking-wider">
              Interactive Viewport
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setPreviewMode("2d")}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  previewMode === "2d" ? "bg-sagedark text-white" : "bg-neutral-100 text-charcoal hover:bg-neutral-200"
                }`}
              >
                2D Flat Cover
              </button>
              <button
                onClick={() => setPreviewMode("3d")}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  previewMode === "3d" ? "bg-sagedark text-white" : "bg-neutral-100 text-charcoal hover:bg-neutral-200"
                }`}
              >
                3D Hardcover Mockup
              </button>
            </div>
          </div>

          {/* Main Rendering Stage Area */}
          <div className="bg-cream/20 border border-lightgray/60 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[440px] relative overflow-hidden shadow-inner">
            
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(#C9A87C10_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Rotation slider helper for 3D */}
            {previewMode === "3d" && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 border border-lightgray/50 px-3 py-1.5 rounded-xl shadow-sm text-xs text-charcoal z-10 select-none">
                <RotateCw className="h-3.5 w-3.5 animate-spin-slow text-gold" />
                <span className="font-semibold text-[10px] tracking-wide">Slide Rotation:</span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-24 accent-sagedark cursor-pointer"
                />
              </div>
            )}

            {/* 2D Preview Mode */}
            {previewMode === "2d" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[280px] aspect-[6/9] rounded-lg shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 select-none border border-black/10"
                style={{ backgroundColor: activePalette.primary }}
              >
                {/* Background Pattern Layer */}
                <div className={`absolute inset-0 opacity-15 pointer-events-none ${activePattern.css}`} style={{ color: activePalette.secondary }} />

                {/* Templates layout renderings */}
                {template === "editorial-minimal" && (
                  <div className="absolute inset-4 border border-white/20 rounded pointer-events-none flex flex-col justify-between p-4">
                    <div className="text-center space-y-1 pt-4">
                      <span className="text-[9px] uppercase tracking-widest text-white/60 font-bold block">
                        A Culinary Compilation
                      </span>
                      <h3 
                        className={`text-2xl leading-tight text-white ${activeFont.titleClass}`}
                        style={{ color: activePalette.secondary }}
                      >
                        {title}
                      </h3>
                      <div className="h-[2px] w-12 bg-white/30 mx-auto mt-3" style={{ backgroundColor: activePalette.accent }} />
                    </div>

                    <div className="flex flex-col items-center space-y-4 pb-4">
                      <div className="text-white opacity-85" style={{ color: activePalette.accent }}>
                        {activeIcon.svg}
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[10px] italic text-white/80 max-w-[180px] mx-auto leading-relaxed">
                          "{subtitle}"
                        </p>
                        <p className={`text-[10px] font-semibold text-white uppercase tracking-widest block pt-2 ${activeFont.bodyClass}`}>
                          {author}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {template === "vintage-badge" && (
                  <div className="absolute inset-0 flex flex-col justify-between p-6 items-center text-center">
                    <div className="pt-2">
                      <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold block">
                        First Edition
                      </span>
                    </div>

                    {/* Central Badge seal */}
                    <div className="relative rounded-full border-4 border-dashed border-white/20 w-44 h-44 flex flex-col items-center justify-center p-3 bg-black/10">
                      <div className="absolute -inset-1 border border-white/10 rounded-full" />
                      <div className="text-white/40 mb-1" style={{ color: activePalette.accent }}>
                        {activeIcon.svg}
                      </div>
                      <h3 
                        className={`text-lg leading-tight text-white font-bold drop-shadow-md ${activeFont.titleClass}`}
                        style={{ color: activePalette.secondary }}
                      >
                        {title}
                      </h3>
                      <span className="text-[8px] uppercase tracking-widest text-white/70 block mt-1">
                        Verified Safe
                      </span>
                    </div>

                    <div className="space-y-1 pb-2">
                      <p className="text-[9px] text-white/80 max-w-[180px] leading-tight italic">
                        {subtitle}
                      </p>
                      <p className={`text-[10px] font-bold text-white uppercase tracking-wider block pt-1 ${activeFont.bodyClass}`}>
                        By {author}
                      </p>
                    </div>
                  </div>
                )}

                {template === "split-modern" && (
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {/* Top Accent block */}
                    <div className="bg-white/95 p-5 text-center shadow-md border-b-4" style={{ borderColor: activePalette.accent }}>
                      <h3 
                        className={`text-xl leading-none text-charcoal font-black ${activeFont.titleClass}`}
                        style={{ color: activePalette.primary }}
                      >
                        {title}
                      </h3>
                      <span className="text-[8px] text-midgray tracking-widest uppercase block mt-1">
                        cookbook volume
                      </span>
                    </div>

                    {/* Central Area */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                      <div className="text-white opacity-85 scale-110" style={{ color: activePalette.secondary }}>
                        {activeIcon.svg}
                      </div>
                    </div>

                    {/* Bottom Author block */}
                    <div className="bg-black/20 p-5 text-center">
                      <p className="text-[9.5px] italic text-white/90 max-w-[200px] mx-auto leading-normal">
                        {subtitle}
                      </p>
                      <p className={`text-[10px] text-white uppercase font-bold tracking-widest block mt-2 ${activeFont.bodyClass}`}>
                        {author}
                      </p>
                    </div>
                  </div>
                )}

                {template === "botanical-border" && (
                  <div className="absolute inset-0 flex flex-col justify-between p-5">
                    {/* Corner Borders */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-white/20" />
                    <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-white/20" />
                    <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-white/20" />
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-white/20" />

                    <div className="text-center pt-4">
                      <div className="text-white/30 mb-2 scale-75" style={{ color: activePalette.accent }}>
                        {activeIcon.svg}
                      </div>
                      <h3 
                        className={`text-2xl leading-tight text-white font-serif tracking-wide ${activeFont.titleClass}`}
                        style={{ color: activePalette.secondary }}
                      >
                        {title}
                      </h3>
                      <div className="h-[1px] w-16 bg-white/20 mx-auto mt-2" />
                    </div>

                    <div className="text-center pb-4 z-10">
                      <div className="bg-black/10 backdrop-blur-[1px] rounded-lg p-2.5 border border-white/5 space-y-1">
                        <p className="text-[9px] text-white/80 leading-relaxed font-sans font-medium">
                          {subtitle}
                        </p>
                        <p className={`text-[9px] font-bold text-white uppercase tracking-widest pt-1 block ${activeFont.bodyClass}`}>
                          {author}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3D Rotating Hardcover Preview Mode */}
            {previewMode === "3d" && (() => {
              const thickness = Math.max(12, Math.min(32, pages * 0.08));
              return (
                <div 
                  className="perspective-1000 flex items-center justify-center py-6"
                  style={{ perspective: "1200px" }}
                >
                  {/* Book Container with CSS 3D Transforms */}
                  <motion.div
                    className="w-[240px] h-[340px] relative cursor-grab active:cursor-grabbing"
                    style={{
                      rotateY: rotation,
                      rotateX: 12,
                      transformStyle: "preserve-3d"
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Book Spine (3D Depth) */}
                    <div
                      className="absolute top-0 bottom-0 bg-black border-r border-black/30 shadow-inner"
                      style={{
                        left: "0px",
                        width: `${thickness}px`,
                        transform: `rotateY(-90deg) translateX(${-thickness / 2}px)`,
                        backgroundColor: activePalette.primary,
                        backgroundImage: activePattern.css,
                        opacity: 0.94,
                        transformStyle: "preserve-3d"
                      }}
                    >
                      {/* Spine Title and Text */}
                      <div className="absolute inset-0 flex flex-col justify-between items-center py-8 text-white select-none pointer-events-none">
                        <span className="text-[8px] font-bold tracking-wider text-white/50 uppercase origin-center rotate-90 whitespace-nowrap mt-4">
                          KDP Spine
                        </span>
                        <h5 className="font-serif text-[9px] font-bold text-white tracking-widest uppercase rotate-90 origin-center whitespace-nowrap my-auto leading-none" style={{ color: activePalette.secondary }}>
                          {title.slice(0, 28)}
                        </h5>
                        <span className="text-[7px] font-mono uppercase tracking-tight text-white/60 rotate-90 origin-center whitespace-nowrap mb-4">
                          {author.slice(0, 16)}
                        </span>
                      </div>
                    </div>

                    {/* Book Pages Block (3D Side Depth) */}
                    <div
                      className="absolute top-[4px] bottom-[4px] bg-neutral-100 shadow-sm border-y border-neutral-300"
                      style={{
                        left: "0px",
                        width: `${thickness}px`,
                        transform: `rotateY(90deg) translateX(${240 - thickness / 2}px)`,
                        backgroundImage: "repeating-linear-gradient(to right, #FAF8F5, #FAF8F5 2px, #E5E3E0 3px, #E5E3E0 4px)"
                      }}
                    />

                    {/* Back Cover (3D Back Depth) */}
                    <div
                      className="absolute inset-0 rounded-r shadow-2xl bg-neutral-800"
                      style={{
                        transform: `translateZ(${-thickness / 2}px) rotateY(180deg)`,
                        backgroundColor: activePalette.primary,
                        backfaceVisibility: "hidden"
                      }}
                    >
                      <div className="absolute inset-4 border border-white/10 rounded p-4 flex flex-col justify-between text-white/40 text-[9px]">
                        <div className="space-y-1">
                          <span className="block font-bold">KDP BACK MATRICES</span>
                          <div className="w-12 h-1 bg-white/10 mt-1" />
                        </div>
                        
                        <div className="text-center p-2 border border-white/5 bg-black/10 rounded font-mono text-[8px] leading-tight">
                          ISBN / BARCODE PLACEHOLDER <br />
                          KDP PAPERBACK {pages}P
                        </div>
                      </div>
                    </div>

                    {/* Front Cover (Main visual panel) */}
                    <div
                      className="absolute inset-0 rounded-r shadow-2xl flex flex-col justify-between p-6 select-none border border-black/10"
                      style={{
                        backgroundColor: activePalette.primary,
                        transform: `translateZ(${thickness / 2}px)`,
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden"
                      }}
                    >
                      {/* Shadow highlight line down the spine fold */}
                      <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-black/15 shadow-sm rounded-l-sm" />

                      {/* Background Pattern Layer */}
                      <div className={`absolute inset-0 opacity-15 pointer-events-none ${activePattern.css}`} style={{ color: activePalette.secondary }} />

                      {/* Templates layout renderings */}
                      {template === "editorial-minimal" && (
                        <div className="absolute inset-4 border border-white/15 rounded pointer-events-none flex flex-col justify-between p-3">
                          <div className="text-center space-y-1 pt-3">
                            <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold block">
                              A Culinary Compilation
                            </span>
                            <h3 
                              className={`text-xl leading-tight text-white ${activeFont.titleClass}`}
                              style={{ color: activePalette.secondary }}
                            >
                              {title}
                            </h3>
                            <div className="h-[1.5px] w-10 bg-white/30 mx-auto mt-2" style={{ backgroundColor: activePalette.accent }} />
                          </div>

                          <div className="flex flex-col items-center space-y-3 pb-2">
                            <div className="text-white opacity-85 scale-90" style={{ color: activePalette.accent }}>
                              {activeIcon.svg}
                            </div>
                            <div className="text-center space-y-0.5">
                              <p className="text-[9px] italic text-white/80 max-w-[150px] mx-auto leading-relaxed">
                                "{subtitle}"
                              </p>
                              <p className={`text-[9px] font-semibold text-white uppercase tracking-widest block pt-1 ${activeFont.bodyClass}`}>
                                {author}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {template === "vintage-badge" && (
                        <div className="absolute inset-0 flex flex-col justify-between p-5 items-center text-center">
                          <div className="pt-2">
                            <span className="text-[8px] uppercase tracking-widest text-white/50 font-bold block">
                              First Edition
                            </span>
                          </div>

                          {/* Central Badge seal */}
                          <div className="relative rounded-full border-2 border-dashed border-white/20 w-36 h-36 flex flex-col items-center justify-center p-2 bg-black/15 scale-95">
                            <div className="absolute -inset-1 border border-white/10 rounded-full" />
                            <div className="text-white/40 scale-75" style={{ color: activePalette.accent }}>
                              {activeIcon.svg}
                            </div>
                            <h3 
                              className={`text-sm leading-tight text-white font-bold drop-shadow-md ${activeFont.titleClass}`}
                              style={{ color: activePalette.secondary }}
                            >
                              {title}
                            </h3>
                            <span className="text-[7px] uppercase tracking-widest text-white/60 block">
                              Verified Safe
                            </span>
                          </div>

                          <div className="space-y-0.5 pb-2">
                            <p className="text-[8px] text-white/80 max-w-[150px] leading-tight italic">
                              {subtitle}
                            </p>
                            <p className={`text-[9px] font-bold text-white uppercase tracking-wider block pt-1 ${activeFont.bodyClass}`}>
                              By {author}
                            </p>
                          </div>
                        </div>
                      )}

                      {template === "split-modern" && (
                        <div className="absolute inset-0 flex flex-col justify-between">
                          {/* Top Accent block */}
                          <div className="bg-white/95 p-4 text-center shadow-md border-b-2" style={{ borderColor: activePalette.accent }}>
                            <h3 
                              className={`text-lg leading-none text-charcoal font-black ${activeFont.titleClass}`}
                              style={{ color: activePalette.primary }}
                            >
                              {title}
                            </h3>
                            <span className="text-[7px] text-midgray tracking-widest uppercase block mt-0.5">
                              cookbook volume
                            </span>
                          </div>

                          {/* Central Area */}
                          <div className="flex-1 flex flex-col items-center justify-center p-3">
                            <div className="text-white opacity-85 scale-90" style={{ color: activePalette.secondary }}>
                              {activeIcon.svg}
                            </div>
                          </div>

                          {/* Bottom Author block */}
                          <div className="bg-black/20 p-4 text-center">
                            <p className="text-[8.5px] italic text-white/90 max-w-[160px] mx-auto leading-normal">
                              {subtitle}
                            </p>
                            <p className={`text-[9px] text-white uppercase font-bold tracking-widest block mt-1.5 ${activeFont.bodyClass}`}>
                              {author}
                            </p>
                          </div>
                        </div>
                      )}

                      {template === "botanical-border" && (
                        <div className="absolute inset-0 flex flex-col justify-between p-4">
                          {/* Corner Borders */}
                          <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t border-l border-white/20" />
                          <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t border-r border-white/20" />
                          <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b border-l border-white/20" />
                          <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b border-r border-white/20" />

                          <div className="text-center pt-3">
                            <div className="text-white/30 scale-75" style={{ color: activePalette.accent }}>
                              {activeIcon.svg}
                            </div>
                            <h3 
                              className={`text-xl leading-tight text-white font-serif tracking-wide ${activeFont.titleClass}`}
                              style={{ color: activePalette.secondary }}
                            >
                              {title}
                            </h3>
                            <div className="h-[1px] w-12 bg-white/20 mx-auto mt-1.5" />
                          </div>

                          <div className="text-center pb-2 z-10">
                            <div className="bg-black/10 backdrop-blur-[1px] rounded-lg p-2 border border-white/5 space-y-0.5">
                              <p className="text-[8px] text-white/80 leading-normal font-sans font-medium">
                                {subtitle}
                              </p>
                              <p className={`text-[8px] font-bold text-white uppercase tracking-widest pt-0.5 block ${activeFont.bodyClass}`}>
                                {author}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })()}
          </div>

          {/* Canva Link helper cards */}
          <div className="rounded-2xl border border-lightgray/60 bg-white p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-gold animate-pulse" />
              <h5 className="text-xs font-bold text-charcoal">Design Success Guidelines</h5>
            </div>
            
            <p className="text-[11px] text-midgray leading-relaxed">
              Once you are happy with this live layout configuration, proceed to <strong>Canva Guides (Module 4)</strong> to claim customized templates mapped to your <strong>{specs.totalWidthInches} x {specs.totalHeightInches}"</strong> full bleeds specs!
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] bg-cream font-bold px-2.5 py-1 border border-lightgray rounded text-charcoal">
                Layout: {template.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </span>
              <span className="text-[10px] bg-cream font-bold px-2.5 py-1 border border-lightgray rounded text-charcoal">
                Font Combo: {activeFont.name}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
